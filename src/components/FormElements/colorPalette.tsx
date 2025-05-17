import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';

type ColorPaletteProps = {
  mainColor: string;
  childColors: string[];
  onColorsChange: (mainColor: string, childColors: string[]) => void;
};

const ColorPalette = ({
  mainColor: initialMainColor,
  childColors: initialChildColors,
  onColorsChange
}: ColorPaletteProps) => {
  const [mainColor, setMainColor] = useState(initialMainColor);
  const [childColors, setChildColors] = useState(initialChildColors);
  const [activePicker, setActivePicker] = useState<{
    type: 'main' | 'child';
    index?: number;
  } | null>(null);

  const handleMainColorChange = (color: string) => {
    setMainColor(color);
    onColorsChange(color, childColors);
  };

  const handleChildColorChange = (color: string, index: number) => {
    const updatedColors = [...childColors];
    updatedColors[index] = color;
    setChildColors(updatedColors);
    onColorsChange(mainColor, updatedColors);
  };

  return (
    <div className="p-6 rounded-xl  shadow-sm">
      {/* Main Color Section */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-400 mb-3">Main Color</h3>
        <div className="flex items-center gap-4">
          <div 
            className="w-16 h-16 rounded-full cursor-pointer border-2 border-gray-200 shadow-sm"
            style={{ backgroundColor: mainColor }}
            onClick={() => setActivePicker({ type: 'main' })}
          />
          <div className="flex flex-col">
            <code className="text-sm text-gray-600">{mainColor}</code>
            <span className="text-xs text-gray-400">Click circle to edit</span>
          </div>
        </div>
      </div>

      {/* Sub Colors Section */}
      <div className="p-4 rounded-lg border border-gray-700 ">
        <h3 className="text-sm font-medium text-gray-400 mb-3">Sub Colors</h3>
        <div className="grid grid-cols-2 gap-4">
          {childColors.map((color, index) => (
            <div key={index} className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-full cursor-pointer border border-gray-300 shadow-sm"
                style={{ backgroundColor: color }}
                onClick={() => setActivePicker({ type: 'child', index })}
              />
              <code className="text-xs text-gray-600">{color}</code>
            </div>
          ))}
        </div>
      </div>

      {/* Color Picker Modal */}
      {activePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-xs">
            <HexColorPicker
              color={
                activePicker.type === 'main' 
                  ? mainColor 
                  : childColors[activePicker.index || 0]
              }
              onChange={(color) => {
                activePicker.type === 'main'
                  ? handleMainColorChange(color)
                  : handleChildColorChange(color, activePicker.index || 0);
              }}
            />
            <div className="mt-4 flex justify-between items-center">
              <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                {activePicker.type === 'main' ? mainColor : childColors[activePicker.index || 0]}
              </code>
              <button
                onClick={() => setActivePicker(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPalette;