const body = document.querySelector("body");
const scanResult = document.querySelector("#scan-result");
const backButton = document.querySelector("#back-button");
const reader = new Html5Qrcode("reader");

backButton.addEventListener("click", resetScanner);

function resetScanner() {
  body.classList.remove(["scanned"]);
  scanResult.textContent = "";
  reader.resume();
}

function onScanSuccess(decodedText, decodedResult) {
  console.log(`Scan result: ${decodedText}`, decodedResult);
  scanResult.textContent = decodedText;
  body.classList.add("scanned");
  reader.pause();
}

function startCamera(cameraId) {
  if (cameraId === "") return;

  if (reader.getState() === Html5QrcodeScannerState.SCANNING) {
    reader.stop();
  }

  // Remember in localstorage to autostart next time
  localStorage.setItem("cameraId", cameraId);

  reader
    .start(
      cameraId,
      {
        facingMode: "environment",
      },
      onScanSuccess
    )
    .catch((err) => {
      // Start failed, handle it.
      console.error("Error starting camera: ", err);
    });
}

// This method will trigger user permissions
Html5Qrcode.getCameras()
  .then((devices) => {
    /**
     * devices would be an array of objects of type:
     * { id: "id", label: "label" }
     */
    if (devices && devices.length) {
      const cameraSelect = document.querySelector("#camera-select");
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.textContent = "Choisissez une caméra";
      cameraSelect.appendChild(defaultOption);

      devices.forEach((device) => {
        const option = document.createElement("option");
        option.value = device.id;
        option.textContent = device.label;
        cameraSelect.appendChild(option);
      });

      // Set the default camera if available
      const savedCameraId = localStorage.getItem("cameraId");
      if (savedCameraId) {
        cameraSelect.value = savedCameraId;
        startCamera(savedCameraId);
      }

      cameraSelect.addEventListener("change", (event) => {
        const selectedCameraId = event.target.value;

        startCamera(selectedCameraId);
      });
    } else {
      console.error("No cameras found.");
    }
  })
  .catch((err) => {
    // handle err
    console.error("Error getting cameras: ", err);
  });
