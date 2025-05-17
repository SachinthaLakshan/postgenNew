import { GoogleGenAI, Modality } from "@google/genai";
import { NextResponse } from "next/server";
// import OpenAI from "openai";
import * as fs from "node:fs";
import { Runware } from "@runware/sdk-js";

// Use Node.js runtime
export const runtime = "nodejs";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });
const runware = new Runware({ apiKey: process.env.RUNWARE_API_KEY });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
  try {
    const body = await request.json();
    const { prompt, numberOfFacts } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt." }, { status: 400 });
    }

    let modifiedPrompt = `Generate ${numberOfFacts} factual items about ${prompt}. For each fact, provide:  

1. **Fact-** [Clear statement of the fact at least 15 words long. make sure this text is not too long only less than 20 words]  
2. **Description:** [100-word engaging description about that fact, explaining it in more detail in a thoughtful, fascinating, and reader-friendly way.]
3. **Highlights:** [highlighted words from the fact]   

**Requirements:** 
- fact must be at least 20 words long   
- Description should be brief but meaningful and at least 100 words long  
- Maintain this exact format for all ${numberOfFacts} facts
- Highlights words .

Example Output:  
1. Fact: The Earth's atmosphere is 78% nitrogen ...  
   Description: Nitrogen is crucial for plant growth but inert for humans ...
   Highlights: [Nitrogen, humans,..]`;

    // First get the text response from GPT-4
    // const textResponse = await openai.chat.completions.create({
    //   model: "gpt-4",
    //   messages: [
    //     {
    //       role: "user",
    //       content: modifiedPrompt
    //     }
    //   ],
    //   max_tokens: 1000 // Added to limit response size
    // });
    const textResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: modifiedPrompt,
    });
    //console.log('textRes>>:',textResponse.candidates[0].content);


    if (!textResponse.candidates[0].content) {
      throw new Error("No content returned from GPT-4");
    }

    const gptResponseContent = textResponse.text;
    const contentArr = parseFacts(gptResponseContent);


    // Generate images for each fact if content exists
    let imageUrls = [];
    if (contentArr.length > 0) {
      // Process images in parallel for better performance
      const imagePromises = contentArr.map(async (fact) => {
        let factPrompt = `Description: ${fact.description}, Generate an image based on this description and create this image with  Hyper realistic natural look. image should be 3:4 aspect ratio.`;
        try {
          // const imageResponse = await openai.images.generate({
          //   model: "dall-e-2", // Specify the model
          //   prompt: factPrompt,
          //   n: 1,
          //   size: "1024x1024"
          // });
          // const imageResponse = await ai.models.generateContent({
          //   model: "gemini-2.0-flash-preview-image-generation",
          //   contents: factPrompt,
          //   config: {
          //     responseModalities: [Modality.TEXT, Modality.IMAGE],
          //   },
          // });
          const images = await runware.requestImages({
            positivePrompt: factPrompt,
            negativePrompt:"",
            width: 768,
            height: 1024,
            model: "rundiffusion:130@100",
            numberResults: 1,
            outputType: "URL" ,
            outputFormat: "PNG",
            uploadEndpoint: ""

          })

          let imageData=images[0].imageURL;
          // for (const part of imageResponse.candidates[0].content.parts) {
          //   // Based on the part type, either show the text or save the image
          //  if (part.inlineData) {
          //     imageData = `data:image/png;base64,${part.inlineData.data}` ;
          //     // const buffer = Buffer.from(imageData, "base64");
          //     // fs.writeFileSync("gemini-native-image.png", buffer);
          //     // console.log("Image saved as gemini-native-image.png");
          //   }
          // }

          return imageData;
        } catch (error) {
          console.error(`Error generating image for fact: ${fact}`, error);
          return null;
        }
      });

      imageUrls = (await Promise.all(imagePromises)).filter(url => url !== null);
    }

    return NextResponse.json({
      content: contentArr,
      images: imageUrls
    }, { status: 200 });

  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      {
        error: "An error occurred, please try again later!",
        details: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 500 }
    );
  }
}


function parseFacts(text) {
  // Split the text into individual fact blocks
  const entries = text.split(/\n(?=\d+\.\s+\*\*Fact:\*\*)/);

  const factObjects = entries.map(entry => {
    // Extract the fact part
    const factMatch = entry.match(/\*\*Fact:\*\*(.*?)\*\*Description:\*\*/s);
    let fact = factMatch ? factMatch[1].trim() : "";

    // Extract the description part
    const descriptionMatch = entry.match(/\*\*Description:\*\*(.*?)\*\*Highlights:\*\*/s);
    let description = descriptionMatch ? descriptionMatch[1].trim() : "";

    // Extract the highlights part
    const highlightsMatch = entry.match(/\*\*Highlights:\*\*\s*\[(.*?)\]/s);
    let highlights = highlightsMatch ? highlightsMatch[1].trim().split(/,\s*/) : [];

    // Remove all asterisks from each highlight
    highlights = highlights.map(highlight => highlight.replace(/\*/g, ''));

    console.log("highlights>>:", highlights);

    let m_fact = fact.replace(/\*/g, '');
    let m_description = description.replace(/\*/g, '');
    return {
      fact: m_fact,
      description: m_description,
      highlights: highlights
    };
  });

  // Filter out any empty entries that might have been created
  return factObjects.filter(obj => obj.fact);
}


