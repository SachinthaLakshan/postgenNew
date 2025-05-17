import { GoogleGenAI, Modality } from "@google/genai";
import { NextResponse } from "next/server";
// import OpenAI from "openai";
import * as fs from "node:fs";
import { Runware } from "@runware/sdk-js";

// Use Node.js runtime
export const runtime = "nodejs";


const runware = new Runware({ apiKey: process.env.RUNWARE_API_KEY });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
  try {
    const body = await request.json();
    const { facts} = body;

    if (!facts) {
      return NextResponse.json({ error: "Missing prompt." }, { status: 400 });
    }

    // Generate images for each fact if content exists
    let imageUrls = [];
    if (facts.length > 0) {
      // Process images in parallel for better performance
      const imagePromises = facts.map(async (fact) => {
       let factPrompt = `Description: ${fact.description}, Generate an image based on this description and create this image with  Hyper realistic natural look. image should be 3:4 aspect ratio.`;
        try {
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

          return imageData;
        } catch (error) {
          console.error(`Error generating image for fact: ${fact}`, error);
          return null;
        }
      });

      imageUrls = (await Promise.all(imagePromises)).filter(url => url !== null);
    }

    return NextResponse.json({
      content: contentAdding(facts),
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


function contentAdding(facts) {
  

  const factObjects = facts.map(entry => {
    
    return {
      fact: entry.rowData.fact,
      description: entry.rowData.description,
      highlights: getRandomWords(entry.rowData.fact,  4)
    };
  });

  // Filter out any empty entries that might have been created
  return factObjects.filter(obj => obj.fact);
}

function getRandomWords(text, count = 4) {
    const words = text
      .replace(/[^\w\s]/g, '') // remove punctuation
      .split(/\s+/)            // split by whitespace
      .filter(word => word.length >= 4); // keep only words with length >= 4

    const uniqueWords = [...new Set(words)];

    if (uniqueWords.length <= count) return uniqueWords;

    const selectedWords = new Set();
    while (selectedWords.size < count) {
      const randomIndex = Math.floor(Math.random() * uniqueWords.length);
      selectedWords.add(uniqueWords[randomIndex]);
    }

    return Array.from(selectedWords);
  }


