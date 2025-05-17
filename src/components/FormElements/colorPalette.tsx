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
    <div className="p-4">
      <div className="flex flex-wrap items-center gap-2 justify-end lg:justify-start">
        {/* Primary Color */}
        <div className="flex flex-col items-center mr-10">
          <span className="text-xs text-gray-500 mb-1">Main Color </span>
          <div
            className="w-15 h-15 rounded-md cursor-pointer border border-gray-200 shadow-sm transition-transform hover:scale-105"
            style={{ backgroundColor: mainColor }}
            onClick={() => setActivePicker({ type: 'main' })}
          />
          <code className="text-xs mt-1">{mainColor}</code>
        </div>

        {/* Color Palette */}
        {childColors.map((color, index) => (
          <div key={index} className="flex flex-col items-center mx-2">
            <span className="text-xs text-gray-500 mb-1">{index + 1}</span>
            <div
              className="w-10 h-10 rounded-md cursor-pointer border border-gray-200 shadow-sm transition-transform hover:scale-110"
              style={{ backgroundColor: color }}
              onClick={() => setActivePicker({ type: 'child', index })}
            />
            <code className="text-xs mt-1">{color}</code>
          </div>
        ))}
      </div>

      {/* Color Picker Modal */}
      {activePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-xs w-full">
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
              className="w-full h-64"
            />
            <div className="mt-5 flex justify-between items-center">
              <code className="text-sm font-mono px-3 py-2 rounded-md flex-1 mr-3 text-center border border-gray-200">
                {activePicker.type === 'main' ? mainColor : childColors[activePicker.index || 0]}
              </code>
              <button
                onClick={() => setActivePicker(null)}
                className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors font-medium"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPalette;