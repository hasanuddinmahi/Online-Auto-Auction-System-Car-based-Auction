// Image preview before upload
function previewBeforeUpload(id) {
    document.querySelector("#" + id).addEventListener("change", function (e) {
      if (e.target.files.length === 0) {
        return;
      }
      let file = e.target.files[0];
      let url = URL.createObjectURL(file);
      document.querySelector("#" + id + "-preview div").innerText = file.name;
      document.querySelector("#" + id + "-preview img").src = url;
    });
  }
  
  for (let i = 1; i <= 8; i++) {
    previewBeforeUpload(`file-${i}`);
  }
  
  // Image validation on form submission
  document.getElementById("imageUploadForm").addEventListener("submit", function (event) {
    let fileCount = 0;
    for (let i = 1; i <= 8; i++) {
      let fileInput = document.getElementById("file-" + i);
      if (fileInput.files.length > 0) {
        fileCount++;
      }
    }
  
    let feedbackMessage = document.getElementById("feedbackMessage");
    if (fileCount < 4) {
      event.preventDefault();
      feedbackMessage.classList.remove("d-none", "alert-success");
      feedbackMessage.classList.add("alert-danger");
      feedbackMessage.textContent = "Please upload at least 4 images.";
    } else {
      feedbackMessage.classList.add("d-none");
    }
  });