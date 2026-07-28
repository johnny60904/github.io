const svgDefinition = `
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
    <rect widht="300" height="300" fill="rgb(22, 27, 34)"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="rgb(139, 148, 158)" font-family="sans-serif" font-size="16">
        Asset Aligned
    </text>
</svg>
`;

const handleImageError = (imageElement) => {
    imageElement.onError = null;
    
    const blob = new Blob([svgDefinition], { type: 'image/svg+xml' });
    const svgUrl = URL.createObjectURL(blob);
    
    imageElement.src = svgUrl;
};

const handleRenderError = (target, message) => {
    const divDefinition = `
    <div class="loader-text" style="color: var(--link-color); white-space: pre-line;">
        Failed to load digital asset metadata stream:\n${message}
    </div>`;
    target.innerHTML = divDefinition;
};

const renderGallery = async () => {
    const galleryRoot = document.getElementById("gallery-root");
    if (!galleryRoot) return;

    try {
        const response = await fetch("../data/spotify-gallery.json");
        
        if (!response.ok) {
            throw new Error(`HTTP network impedance failure: [Status ${response.status}].`);
        }

        const galleryData = await response.json();
        
        if (!Array.isArray(galleryData) || galleryData.length === 0) {
            throw new Error("Target json is empty or structurally corrupted.");
        }

        galleryRoot.innerHTML = "";
        
        galleryData.forEach(item => {
            
            const card = document.createElement("article");
            card.className = "art-card";
            
            const imgElement = document.createElement("img");
            imgElement.src = `../images/projects/${item.img}`;
            imgElement.alt = item.title;
            
            const titleElement = document.createElement("h3");
            titleElement.textContent = item.title;
            
            const descElement = document.createElement("p");
            descElement.textContent = item.desc;
            
            imgElement.onerror = () => handleImageError(imgElement);
            
            card.appendChild(imgElement);
            card.appendChild(titleElement);
            card.appendChild(descElement);
            
            galleryRoot.appendChild(card);
        });

    } catch (error) {
        handleRenderError(galleryRoot, error.message);
        console.error("Gallery runtime asynchronous breakdown:", error);
    }
};

document.addEventListener("DOMContentLoaded", renderGallery);