const displayBox = document.getElementById('displayBox');
const displayValue = document.getElementById('displayValue');
const editorBox = document.getElementById('editorBox');
const closeBtn = document.getElementById('closeBtn');
const applyBtn = document.getElementById('applyBtn');
const textInput = document.getElementById('textInput');

// Show editor on click
displayBox.addEventListener('click', () => {
  textInput.value = displayValue.textContent;
  displayBox.style.display = 'none';
  editorBox.style.display = 'flex';
  textInput.focus();
});

// Close editor without changes
closeBtn.addEventListener('click', () => {
  editorBox.style.display = 'none';
  displayBox.style.display = 'flex';
});

// Apply changes
applyBtn.addEventListener('click', () => {
  displayValue.textContent = textInput.value.trim() || 'Click to edit me';
  editorBox.style.display = 'none';
  displayBox.style.display = 'flex';
});
