let bannerCount = 0;
const placeholderImage = "https://via.placeholder.com/1460x560?text=Preview";

function createBannerElement(id) {
  const banner = document.createElement("div");
  banner.className = "banner";

  banner.innerHTML = `
        <div class="image-box">
            <img class="imagePreview" src="${placeholderImage}" alt="Банер изображение" />
        </div>
        <div class="info-box">
            <label class="banner-label drag-handle">dynamic_banner_${id}</label>
            <input type="text" placeholder="Заглавие" name="Banners[${id}].Title">
            <input type="text" placeholder="Линк" name="Banners[${id}].Link">
            <input type="file" accept="image/*" class="imageInput" name="Banners[${id}].Image">
            <input type="hidden" class="sequenceInput" name="Banners[${id}].Sequence" value="${id}">
            <div class="button-group">
                <button class="save-btn" disabled>Запази</button>
                <button class="preview-btn">Преглед</button>
                <button class="delete-btn">Изтрий</button>
            </div>
        </div>
    `;

  const fileInput = banner.querySelector(".imageInput");
  const imgPreview = banner.querySelector(".imagePreview");
  const saveBtn = banner.querySelector(".save-btn");
  const deleteBtn = banner.querySelector(".delete-btn");
  const previewBtn = banner.querySelector(".preview-btn");
  const inputs = banner.querySelectorAll("input");

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imgPreview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      imgPreview.src = placeholderImage;
    }
    saveBtn.disabled = false;
  });

  // Активиране на бутона "Запази" при промяна в някое поле
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      saveBtn.disabled = false;
    });
  });

  // Изтриване на банера
  deleteBtn.addEventListener("click", () => {
    banner.remove();
    renumberBanners();
  });

  // Преглед на банера в модален прозорец
  previewBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const src = imgPreview.src;
    if (src && src !== placeholderImage) {
      openModal(src);
    } else {
      alert("Няма качено изображение за преглед.");
    }
  });

  // Симулирано запазване
  saveBtn.addEventListener("click", () => {
    alert("Банерът е запазен.");
    saveBtn.disabled = true;
  });

  return banner;
}

function renumberBanners() {
  const banners = document.querySelectorAll("#banners-container .banner");
  banners.forEach((banner, index) => {
    const label = banner.querySelector(".banner-label");
    label.textContent = `dynamic_banner_${index + 1}`;

    const seqInput = banner.querySelector(".sequenceInput");
    if (seqInput) {
      seqInput.value = index + 1;
      seqInput.name = `Banners[${index}].Sequence`;
    }

    const textInputs = banner.querySelectorAll(
      "input[type=text], input[type=file]"
    );
    const fields = ["Title", "Link", "Image"];
    textInputs.forEach((input, i) => {
      input.name = `Banners[${index}].${fields[i]}`;
    });
  });
}

document.getElementById("addBannerBtn").addEventListener("click", () => {
  bannerCount++;
  const bannerElement = createBannerElement(bannerCount);
  document.getElementById("banners-container").appendChild(bannerElement);
  renumberBanners();
});

// По подразбиране добавяме един банер
document.getElementById("addBannerBtn").click();

// Drag & drop
new Sortable(document.getElementById("banners-container"), {
  animation: 150,
  handle: ".drag-handle",
  ghostClass: "sortable-ghost",
  onEnd: () => {
    renumberBanners();
  },
});

// Modal функции
function openModal(src) {
  const modal = document.getElementById("previewModal");
  const modalImage = document.getElementById("modalImage");
  modalImage.src = src;
  modal.classList.add("show");
}

function closeModal() {
  const modal = document.getElementById("previewModal");
  modal.classList.remove("show");
  document.getElementById("modalImage").src = "";
}
