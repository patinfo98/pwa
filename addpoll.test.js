import { resetColors } from "./addpoll.js"

const updateUserPolls = (pollData) => {
  if (!pollData.question || !pollData.options) {
    throw new Error("Invalid poll data");
  }
  return true;
};

    beforeEach(() => {
    document.body.innerHTML = `
      <div id="colorContainer" class="addPollContainer">
        <label class="label">choose color</label>
            <div id="colorPalette">
                <div class="color" id="color1" onClick="selectColor(this)"></div>
                <div class="color" id="color2" onClick="selectColor(this)"></div>
                <div class="color" id="color3" onClick="selectColor(this)"></div>
                <div class="color" id="color4" onClick="selectColor(this)"></div>
                <div class="color" id="color5" onClick="selectColor(this)"></div>
                <div class="color" id="color6" onClick="selectColor(this)"></div>
            </div>
                <input type="hidden" id="selectedColorInput" name="color" value="color1">
            </div>
    `;
  });

describe('updateUserPolls', () => {
  test('should throw an error if pollData is incomplete', () => {
    expect(() => updateUserPolls({ question: 'Favorite color?' })).toThrow("Invalid poll data");
    expect(() => updateUserPolls({ options: ['Red', 'Blue'] })).toThrow("Invalid poll data");
  });

  it("should reset colors when resetColors is called", () => {
      const colorElement = document.querySelector(".color");
      colorElement.style.border = "3px solid white";

      resetColors();

      expect(colorElement.style.border).toBe("transparent");
    });

  test('should return true for valid poll data', () => {
    const result = updateUserPolls({ question: 'Favorite color?', options: ['Red', 'Blue'] });
    expect(result).toBe(true);
  });
});

