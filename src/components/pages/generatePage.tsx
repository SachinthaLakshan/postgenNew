'use client';
import { cn } from "@/lib/utils";
import InputGroup from "../FormElements/InputGroup";
import { GlobeIcon } from "@/assets/icons";
import { TextAreaGroup } from "../FormElements/InputGroup/text-area";
import ImageOverlay from "../imageOverlay";
import { useState } from "react";
import { toast } from "react-toastify";
import { ShowcaseSection } from "../Layouts/showcase-section";
import { RadioInput } from "../FormElements/radio";
import ColorPaletteInput from "../FormElements/colorPalette";
import ColorPalette from "../FormElements/colorPalette";
import ExcelFileuploaderButton from "../FormElements/excelFileuploaderButton";

type FactType = {
  fact: string;
  description: string;
  highlights: string[];
};

type ApiResponse = {
  content: FactType[];
  images: string[];
};

type PropsType = {
  className?: string;
};

type FactRow = {
  rowData: {
    fact: string;
    description: string;
  };
};

export function GeneratePage({ className }: PropsType) {
  const [prompt, setPrompt] = useState("");
  const [factCount, setFactCount] = useState(5);
  const [pageName, setPageName] = useState("Strange And Interesting Things");
  const [mode, setMode] = useState<'auto' | 'manual' | ''>('auto');
  const [colors, setColors] = useState({
    main: '#fff',
    child: ['#c4a5df', '#ffd700', '#f06292', '#66ff73']
  });
  const [data, setData] = useState<ApiResponse>({
    "content": [
      // {
      //   "fact": "Certain species of bioluminescent fungi can increase their light emission by over 300% when subjected to mild mechanical stress, hinting at a novel defense mechanism.",
      //   "description": "While bioluminescent fungi are known to glow, the dramatic surge in light output under physical pressure is a recently observed phenomenon. Scientists hypothesize that this heightened illumination might serve as a \"burglar alarm,\" attracting nocturnal insects that then prey on the invertebrates damaging the fungi. This defense strategy represents a fascinating interplay between light emission, mechanical stimulation, and interspecies communication within the forest ecosystem. The increase in luminescence might also startle potential herbivores, deterring them from further consumption.",
      //   "highlights": [
      //     "bioluminescent fungi",
      //     "light emission",
      //     "mechanical stress",
      //     "defense mechanism"
      //   ]
      // },
      // {
      //   "fact": "Ancient Mesopotamian cylinder seals, often considered signatures, sometimes contained deliberate errors, possibly to prevent exact replication and ensure authenticity.",
      //   "description": "Mesopotamian cylinder seals were intricately carved miniature artworks rolled onto clay to create impressions. While they functioned as signatures and identifiers, the purposeful inclusion of small, almost imperceptible imperfections has been discovered in some. The intention behind this practice may have been to thwart forgeries, creating a unique \"fingerprint\" within the seal's design that would be difficult to duplicate without the original seal itself. This hints at a sophisticated understanding of security and authentication even in the ancient world.",
      //   "highlights": [
      //     "Mesopotamian cylinder seals",
      //     "deliberate errors",
      //     "replication",
      //     "authenticity"
      //   ]
      // },
      // {
      //   "fact": "Specific quantum entanglement patterns observed in simulated black hole evaporation events correlate with previously unknown subatomic particle spin configurations.",
      //   "description": "The study of Hawking radiation, the theoretical emission from black holes, is notoriously difficult. Scientists use simulations to gain insight. Intriguingly, during simulated black hole evaporation, the quantum entanglement patterns between escaping particles are showing correspondence with unique spin configurations that have not been fully described in the existing particle physics models. This could mean that information from within the black hole is encoded in these subatomic spin configurations during the evaporation process, offering a new avenue to explore the quantum nature of spacetime.",
      //   "highlights": [
      //     "quantum entanglement",
      //     "black hole evaporation",
      //     "subatomic particle spin",
      //     "configurations"
      //   ]
      // },
      // {
      //   "fact": "Certain deep-sea crustaceans exhibit a form of \"ecological echolocation,\" using the reflections of bioluminescent plankton swarms to navigate pitch-black environments.",
      //   "description": "Echolocation is usually associated with bats and dolphins, but some deep-sea crustaceans have adapted a similar technique using bioluminescence instead of sound. These creatures emit a faint light that illuminates bioluminescent plankton swarms. By sensing the subtle reflections of this plankton-generated light, they are able to create a mental map of their surroundings, effectively \"seeing\" in the dark without the need for conventional vision. This unusual adaptation highlights the diverse strategies life employs to thrive in the challenging conditions of the deep ocean.",
      //   "highlights": [
      //     "deep-sea crustaceans",
      //     "ecological echolocation",
      //     "bioluminescent plankton",
      //     "navigate"
      //   ]
      // },
      // {
      //   "fact": "Human gut bacteria can be directly influenced by prolonged exposure to classical musical structures, with measurable changes in metabolic byproduct production observed.",
      //   "description": "The gut microbiome is increasingly recognized as a powerful regulator of human health. Recent studies suggest that prolonged exposure to classical musical compositions can alter the composition and activity of gut bacteria. Specific classical pieces have been shown to induce shifts in the production of metabolic byproducts, such as short-chain fatty acids, which are vital for gut health and overall well-being. This points to a potential link between the auditory environment, the gut microbiome, and overall physiological health, suggesting that music therapy could be a viable avenue for improving gut health.",
      //   "highlights": [
      //     "gut bacteria",
      //     "classical music",
      //     "metabolic byproduct",
      //     "production"
      //   ]
      // }
    ],
    images: [
      // "https://im.runware.ai/image/ws/2/ii/771ad03b-e375-4e6b-96aa-e2456876fa52.png",
      // "https://im.runware.ai/image/ws/2/ii/6c166981-8aa7-400e-97cf-cd641c48eb40.png",
      // "https://im.runware.ai/image/ws/2/ii/08f7a48c-6e5a-45a7-b2f0-cf4b65b55c44.png",
      // "https://im.runware.ai/image/ws/2/ii/a765a2a3-67a9-43ea-985a-4183ff67e0b8.png",
      // "https://im.runware.ai/image/ws/2/ii/c25d15e8-aaa4-49e3-8aef-a4e956b422b9.png"
    ]
  });
  const [loading, setLoading] = useState(false);

  async function generateImages(refinedPrompt: string) {
    const res = await fetch("/api/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: refinedPrompt, numberOfFacts: factCount }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to generate images");
    }
    return await res.json();
  }

  async function generateImagesManually() {
    const res = await fetch("/api/generate-image-manual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ facts: uploadedData }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to generate images");
    }
    return await res.json();
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      toast.error("Please enter a prompt.");
      return;
    }
    setLoading(true);
    try {
      let response;
      if (mode === 'manual') {
        response = await generateImagesManually();
      } else {
        response = await generateImages(prompt);
      }

      if (response) {
        const data1: ApiResponse = { content: [...data.content, ...response.content], images: [...data.images, ...response.images] };
        setData(data1);
        toast.success(`${response.images.length} Content generated successfully!`);
      }

    } catch (err: any) {
      toast.error(err.message || "Failed to generate content.");
    }
    setLoading(false);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMode(e.target.value as 'auto' | 'manual');
    setPrompt("");
    setFactCount(0);
    setUploadedData([]);
  };

  const handleColorsChange = (mainColor: string, childColors: string[]) => {
    setColors({
      main: mainColor,
      child: childColors
    });
  };

  const [uploadedData, setUploadedData] = useState<FactRow[]>([]);

  const handleFileUpload = (data: FactRow[]) => {
    setUploadedData(data);
    setPrompt(formatFactsForTextarea(data));
    setFactCount(data.length);
  };

  function formatFactsForTextarea(data: FactRow[]): string {
    return data
      .map(
        (item, index) =>
          `Fact ${index + 1}:\n${item.rowData.fact}\nDescription:\n${item.rowData.description}\n`
      )
      .join('\n');
  }

  return (
    <>
      <div
        className={cn(
          "grid gap-2 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
          className,
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
            Generate Your Content
          </h2>
        </div>
        <form onSubmit={handleGenerate} className="mt-6">
          <div className="mb-4 flex items-center gap-4">
            <RadioInput value="auto" checked={mode === 'auto'} onChange={handleChange} label="Auto" />
            <RadioInput value="manual" checked={mode === 'manual'} onChange={handleChange} label="Manual" />
          </div>
          <ColorPalette mainColor={colors.main} childColors={colors.child} onColorsChange={handleColorsChange} />
          <div>
            {mode == 'manual' && <ExcelFileuploaderButton onFileUpload={handleFileUpload} />}
          </div>
          <InputGroup
            type="text"
            label="Page Name"
            className="mb-4 [&_input]:py-[15px]"
            placeholder="Enter your page name"
            handleChange={(e) => setPageName(e.target.value)}
            value={pageName}
          />
          <InputGroup
            type="number"
            label="Number of Facts"
            disabled={mode === 'manual'}
            className="mb-4 [&_input]:py-[15px]"
            placeholder="Enter number of facts"
            handleChange={(e) => setFactCount(Number(e.target.value))}
            value={factCount}
          />
          <TextAreaGroup
            disabled={mode === 'manual'}
            className="mb-4 [&_input]:py-[15px]"
            placeholder={mode === 'manual' ? "Please upload user CSV or Excel file" : "Enter your prompt.\n Eg: Generate facts about the universe."}
            handleChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            icon={<GlobeIcon />}
          />
          <div className="mb-4.5">
            <button
              type="submit"
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
              disabled={loading}
            >
              Generate
              {loading && (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Output Section */}
      <div
        className={cn(
          "grid gap-2 mt-6 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
          className,
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
            Generated Content
          </h2>
        </div>

        {/* Content Display */}
        <div className="mt-6">
          {data.content.length > 0 ? (
            <div className="space-y-8">
              {/* Grid of Images */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {data.images.map((imageUrl, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-700 ">
                    {imageUrl && (
                      <ImageOverlay
                        content={data.content[index]}
                        imageUrl={imageUrl}
                        pageName={pageName}
                        colors={colors}
                      />
                    )}
                  </div>
                ))}
              </div>


            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">
                {loading ? 'Generating content...' : 'No content generated yet. Enter a prompt and click Generate.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}