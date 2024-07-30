// In editor.js
let easyMDE;

function initializeEditor() {
  easyMDE = new EasyMDE({
    element: document.getElementById("editor"),
    spellChecker: true,
    autosave: {
      enabled: true,
      uniqueId: "blogPost",
    },
    toolbar: [
      "bold",
      "italic",
      "heading",
      "|",
      "code",
      "clean-block",
      "quote",
      "|",
      // "table",
      "unordered-list",
      "ordered-list",
      "|",
      "link",
      "image",
      "|",
      "preview",
      "side-by-side",
      "fullscreen",
      "|",
      "guide",
    ],
  });
}

function getEditorContent() {
  return easyMDE.value();
}

function setEditorContent(content) {
  easyMDE.value(content);
}

function togglePreview() {
  easyMDE.togglePreview();
}

async function publishPost() {
  const title = document.getElementById("postTitle").value;
  const content = getEditorContent();
  const image = document.getElementById("postImage").files[0];

  try {
    await createPost(title, content, image);
    alert("Post published successfully!");
    showHomePage();
  } catch (error) {
    alert("Error publishing post: " + error.message);
  }
}
