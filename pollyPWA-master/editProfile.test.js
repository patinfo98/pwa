import {
    resetColors,
    resetIcons,
    selectColor,
    selectIcon,
    initializeProfileData,
    getUserColorElement,
    getUserIconElement
} from "./editProfile";

  beforeEach(() => {
    // Mock DOM elements
    document.body.innerHTML = `
      <form id="editProfileForm">
        <input type="text" id="nameInput" name="name">
        <input type="text" id="ageInput" name="age">
        <textarea id="description" name="description"></textarea>
        <input type="hidden" id="selectedColorInput" name="color">
        <input type="hidden" id="selectedIconInput" name="icon">
      </form>
      <div class="color" style="background-color: #FF0000"></div>
      <img class="icon" src="https://example.com/icon.png">
    `;
  });

  it("should reset colors when resetColors is called", () => {
    const colorElement = document.querySelector(".color");
    colorElement.style.border = "3px solid white";

    resetColors();

    expect(colorElement.style.border).toBe("transparent");
  });

  it("should reset icons when resetIcons is called", () => {
    const iconElement = document.querySelector(".icon");
    iconElement.style.border = "3px solid black";

    resetIcons();

    expect(iconElement.style.border).toBe("transparent");
  });

  it("should select a color and update the input value", () => {
    const colorElement = document.querySelector(".color");
    selectColor(colorElement);

    expect(document.getElementById("selectedColorInput").value).toBe("rgb(255, 0, 0)");
    expect(colorElement.style.border).toBe("3px solid white");
  });

  it("should select an icon and update the input value", () => {
    const iconElement = document.querySelector(".icon");
    selectIcon(iconElement);

    expect(document.getElementById("selectedIconInput").value).toBe("https://example.com/icon.png");
    expect(iconElement.style.border).toBe("3px solid black");
  });
