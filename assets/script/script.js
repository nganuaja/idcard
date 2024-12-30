function openModal(modalId) {
	const modal = document.getElementById(modalId);
	const overlay = document.querySelector('.modal-overlay');

	if (!modal) return;

	if (['brightness-modal', 'contrast-modal', 'saturation-modal'].includes(modalId)) {
		header.style.transform = 'translateY(-60px)';
		content.style.transform = 'translateY(-60px)';
		frontCard.style.transform = 'translateY(-60px)';
		backCard.style.transform = 'translateY(-60px)';
	}

	if (['position-modal', 'size-modal'].includes(modalId)) {
		header.style.transform = 'translateY(-115px)';
		content.style.transform = 'translateY(-115px)';
		frontCard.style.transform = 'translateY(-115px)';
		backCard.style.transform = 'translateY(-115px)';
	}

	modal.classList.add('active');
	overlay.classList.add('active');
}

function closeModal(modalId) {
	const modal = document.getElementById(modalId);
	const overlay = document.querySelector('.modal-overlay');
	modal.classList.remove('active');
	overlay.classList.remove('active');
	header.style.transform = 'translateY(0)';
	content.style.transform = 'translateY(0)';
	frontCard.style.transform = 'translateY(0)';
	backCard.style.transform = 'translateY(0)';
}

document.querySelector('.modal-overlay').addEventListener('click', () => {
	document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('active'));
	document.querySelector('.modal-overlay').classList.remove('active');
	header.style.transform = 'translateY(0)';
	content.style.transform = 'translateY(0)';
	frontCard.style.transform = 'translateY(0)';
	backCard.style.transform = 'translateY(0)';
});

//-------------------------------------------------

const frontCanvas = document.getElementById('frontCard');
const backCanvas = document.getElementById('backCard');
const frontCtx = frontCanvas.getContext('2d');
const backCtx = backCanvas.getContext('2d');

const frontTemplate = new Image();
frontTemplate.src = 'assets/img/depan.png';

const backTemplate = new Image();
backTemplate.src = 'assets/img/belakang.png';

let photo = null;
let photoX = 0;
let photoY = 0;
let photoWidth = 638;
let photoHeight = 1012;

let brightness = 100;
let contrast = 100;
let saturation = 100;

const SCALE_FACTOR = 3;

frontTemplate.onload = updateCanvas;
backTemplate.onload = updateCanvas;

function capitalizeWords(str) {
	return str.replace(/\b\w/g, char => char.toUpperCase());
}

function updateDisplay() {
  brightnessValue.textContent = `${brightnessBar.value-100}%`;
  contrastValue.textContent = `${contrastBar.value-100}%`;
  saturationValue.textContent = `${saturationBar.value-100}%`;
}

function updateLabel() {
const idType = document.getElementById('idType').value;

const idLabel = document.getElementById('idLabel');
if (idType === 'NIPPOS') {
	idLabel.innerHTML = `
		NIPPOS :
		<input type="text" id="idNumber" placeholder="Masukkan NIPPOS" oninput="updateCanvas()">
	`;
} else if (idType === 'NIK') {
	idLabel.innerHTML = `
		NIK :
		<input type="text" id="idNumber" placeholder="Masukkan NIK" oninput="updateCanvas()">
	`;
}
updateCanvas();
}

function drawJustifiedText(ctx, text, x, maxWidth, currentY, lineHeight) {
  let words = text.split(' ');
  let line = '';
  let lines = [];

  words.forEach((word) => {
    let testLine = line + word + ' ';
    let testWidth = ctx.measureText(testLine).width;

    if (testWidth > maxWidth - 20) {
      lines.push(line.trim());
      line = word + ' ';
    } else {
      line = testLine;
    }
  });
  lines.push(line.trim());

  lines.forEach((wrappedLine, index) => {
    if (index === lines.length - 1) {
      ctx.fillText(wrappedLine, x + 20, currentY + index * lineHeight);
    } else {
      let wordsInLine = wrappedLine.split(' ');
      let totalWords = wordsInLine.length;

      if (totalWords > 1) {
        let lineWidth = ctx.measureText(wrappedLine.replace(/\s+/g, '')).width;
        let extraSpace = (maxWidth - 20 - lineWidth) / (totalWords - 1);

        let currentX = x + 20;
        wordsInLine.forEach((word, wordIndex) => {
          ctx.fillText(word, currentX, currentY + index * lineHeight);
          if (wordIndex < totalWords - 1) {
            currentX += ctx.measureText(word).width + extraSpace;
          }
        });
      } else {
        ctx.fillText(wrappedLine, x + 20, currentY + index * lineHeight);
      }
    }
  });

  return currentY + lines.length * lineHeight;
}

function drawBulletedJustifiedText(ctx, texts, x, maxWidth, startY, lineHeight) {
  let currentY = startY;

  texts.forEach((text) => {
    ctx.fillText('•', x, currentY);

    currentY = drawJustifiedText(ctx, text, x, maxWidth, currentY, lineHeight);
  });
}

function updateCanvas() {
	console.log("Updating canvas...");
	const scaleFactor = SCALE_FACTOR;

	frontCanvas.width = 638 * scaleFactor;
	frontCanvas.height = 1012 * scaleFactor;
	backCanvas.width = 638 * scaleFactor;
	backCanvas.height = 1012 * scaleFactor;

	frontCtx.scale(scaleFactor, scaleFactor);
	backCtx.scale(scaleFactor, scaleFactor);

	frontCtx.clearRect(0, 0, frontCanvas.width, frontCanvas.height);
	frontCtx.drawImage(frontTemplate, 0, 0, frontCanvas.width / scaleFactor, frontCanvas.height / scaleFactor);

	const name = capitalizeWords(document.getElementById('name').value);
	const idNumber = document.getElementById('idNumber').value;
	const idType = document.getElementById('idType').value;
	
	if (photo) {
		console.log("Drawing photo on canvas...");
		const scaledWidth = photoWidth * SCALE_FACTOR;
		const scaledHeight = photoHeight * SCALE_FACTOR;
		frontCtx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
		frontCtx.drawImage(photo, photoX, photoY, photoWidth, photoHeight);
		frontCtx.filter = 'none';
	}

	frontCtx.font = 'normal 44px Ebrima';
	frontCtx.fillStyle = 'white';
	frontCtx.fillText(name, 62, 327);

	frontCtx.font = '32px Ebrima';
	frontCtx.fillText(`${idType}. ${idNumber}`, 62, 375);

	backCtx.clearRect(0, 0, backCanvas.width, backCanvas.height);
	backCtx.drawImage(backTemplate, 0, 0, backCanvas.width / scaleFactor, backCanvas.height / scaleFactor);

	backCtx.font = 'normal 38px Ebrima';
	backCtx.fillStyle = 'white';
	backCtx.fillText(name, 63, 157);

	backCtx.font = '26px Ebrima';
	backCtx.fillText(`${idType}. ${idNumber}`, 63, 195);

	// backCtx.font = 'bold 19px Ebrima';
	// backCtx.fillText(`Perhatian :`, 63, 270);
	// frontCtx.font = '18px Ebrima';
	
	// let texts = [
	  // 'Pemegang kartu ini menyatakan tunduk dan mengikatkan diri pada syarat dan ketentuan yang berlaku.',
	  // 'Kartu tanda pengenal ini berlaku selama yang bersangkutan melaksanakan tugas di lingkungan PT. Pos Indonesia (Persero).',
	  // 'Bilamana menemukan kartu ini mohon dikembalikan segera ke Unit Kerja Kantor Pos Terdekat.'
	// ];

	// drawBulletedJustifiedText(frontCtx, texts, 63, 360, 400, 25);
	
	console.log("Canvas updated successfully.");
}

function processPhoto() {
	const file = document.getElementById('photoUpload').files[0];
	if (!file) return;

	const formData = new FormData();
	formData.append('image_file', file);

	fetch('https://api.remove.bg/v1.0/removebg', {
		method: 'POST',
		headers: {
			'X-Api-Key': 'sFjZFWE6e83yrkgSEcHT5bGx'
		},
		body: formData
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return response.blob();
		})
		.then((blob) => {
			const url = URL.createObjectURL(blob);
			photo = new Image();
			photo.onload = () => {
				console.log("Photo loaded successfully");
				updateCanvas();
			};
			photo.src = url;
		})
		.catch((error) => {
			alert('Gagal memproses foto: ' + error.message);
			updateCanvas();
		});
}

function createHighResCanvas(originalCanvas, scaleFactor) {
	const highResCanvas = document.createElement('canvas');
	highResCanvas.width = originalCanvas.width * scaleFactor;
	highResCanvas.height = originalCanvas.height * scaleFactor;

	const highResCtx = highResCanvas.getContext('2d');
	highResCtx.scale(scaleFactor, scaleFactor);

	highResCtx.drawImage(originalCanvas, 0, 0, originalCanvas.width, originalCanvas.height);

	return highResCanvas;
}

function attemptDownload() {
	const nameInput = document.getElementById('name');
	const idNumberInput = document.getElementById('idNumber');
	const photoInput = document.getElementById('photoUpload');

	const name = nameInput.value.trim();
	const idNumber = idNumberInput.value.trim();
	const photo = photoInput.files[0];

	resetError(nameInput);
	resetError(idNumberInput);
	resetError(photoInput);

	if (!name) {
		alert("Harap masukkan nama terlebih dahulu!");
		setError(nameInput);
		return;
	}
	if (!idNumber) {
		alert("Harap masukkan nomor ID (NIPPOS) terlebih dahulu!");
		setError(idNumberInput);
		return;
	}
	if (!photo) {
		alert("Harap unggah foto terlebih dahulu!");
		setError(photoInput);
		return;
	}

	downloadCanvas();
}

function setError(inputElement) {
	inputElement.classList.add('input-error');
	inputElement.focus();
}

function resetError(inputElement) {
	inputElement.classList.remove('input-error');
}

function downloadCanvas() {
	const name = capitalizeWords(document.getElementById('name').value).replace(/[^a-zA-Z0-9]/g, '_');

	const highResFrontCanvas = createHighResCanvas(frontCanvas, SCALE_FACTOR);
	const frontLink = document.createElement('a');
	frontLink.download = `${name}_depan.png`;
	frontLink.href = highResFrontCanvas.toDataURL('image/png', 1.0);
	console.log("Downloading front canvas...");
	frontLink.click();

	const highResBackCanvas = createHighResCanvas(backCanvas, SCALE_FACTOR);
	const backLink = document.createElement('a');
	backLink.download = `${name}_belakang.png`;
	backLink.href = highResBackCanvas.toDataURL('image/png', 1.0);
	console.log("Downloading back canvas...");
	backLink.click();
}

document.getElementById('photoX').addEventListener('input', function() {
	photoX = this.value;
	updateCanvas();
});

document.getElementById('photoY').addEventListener('input', function() {
	photoY = this.value;
	updateCanvas();
});

document.getElementById('photoWidth').addEventListener('input', function() {
	photoWidth = this.value;
	updateCanvas();
});

document.getElementById('photoHeight').addEventListener('input', function() {
	photoHeight = this.value;
	updateCanvas();
});

brightnessBar.addEventListener('input', () => {
	brightness = brightnessBar.value;
	updateDisplay();
	updateCanvas();
});

contrastBar.addEventListener('input', () => {
	contrast = contrastBar.value;
	updateDisplay();
	updateCanvas();
});

saturationBar.addEventListener('input', () => {
	saturation = saturationBar.value;
	updateDisplay();
	updateCanvas();
});

function resetSettings() {
	brightnessBar.value = 100;
	contrastBar.value = 100;
	saturationBar.value = 100;
	photoX = 0;
	photoY = 0;
	photoWidth = 638;
	photoHeight = 1012;

	brightness = 100;
	contrast = 100;
	saturation = 100;

	document.getElementById('photoX').value = photoX;
	document.getElementById('photoY').value = photoY;
	document.getElementById('photoWidth').value = photoWidth;
	document.getElementById('photoHeight').value = photoHeight;

	updateDisplay();
	updateCanvas();
}