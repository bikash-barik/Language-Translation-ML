// Wait for the DOM to be fully loaded before attaching event handlers
document.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements
    const sourceText = document.getElementById("sourceText");
    const wordCount = document.getElementById("wordCount");
    const submitBtn = document.getElementById("submitbtn");
    const resultDiv = document.getElementById("result");
    const sourceLanguage = document.getElementById("sourceLanguage");
    const targetLanguage = document.getElementById("targetLanguage");

    // Attach event listeners
    sourceText.addEventListener('input', countWords);
    submitBtn.addEventListener('click', translate);

    // Function to count words
    function countWords() {
        const text = sourceText.value;
        const words = text.split(/\s+/).filter(word => word !== "");
        wordCount.textContent = `${words.length}/512`;
    }

    // Function to handle translation
    async function translate() {
        const sourceLang = sourceLanguage.value;
        const targetLang = targetLanguage.value;
        const text = sourceText.value.trim();

        // Validate inputs
        if (!sourceLang || !targetLang) {
            alert("Please select both source and target languages");
            return;
        }

        if (!text) {
            alert("Please enter text to translate");
            return;
        }

        // Show loading state
        resultDiv.value = "Translating...";
        submitBtn.disabled = true;

        try {
            const payload = {
                sourceLanguage: sourceLang,
                targetLanguage: targetLang,
                input: text,
                task: "translation",
                serviceId: "ai4bharat/indictrans--gpu-t4",
                track: true
            };

            const response = await fetch("https://admin.models.ai4bharat.org/inference/translate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data?.output?.[0]?.target) {
                resultDiv.value = data.output[0].target;
            } else {
                resultDiv.value = "Translation failed. Please try again.";
            }
        } catch (error) {
            console.error("Translation error:", error);
            resultDiv.value = "Error in translation. Please try again.";
        } finally {
            submitBtn.disabled = false;
        }
    }
});