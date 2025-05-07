// Initialiser EmailJS med din brukernøkkel
emailjs.init(W9z9B6eJBVVeHAjY9); 

document.getElementById("avviksskjema").addEventListener("submit", async function(event) {
  event.preventDefault();

  const sjofor = document.getElementById("sjofor").value;
  const kunde = document.getElementById("kunde").value;
  const avvik = document.getElementById("avvik").value;
  const bilder = document.getElementById("bilder").files;
  const dato = new Date().toLocaleString("nb-NO");

  if (bilder.length === 0) {
    alert("Vennligst last opp minst ett bilde.");
    return;
  }

  // Last opp bilder til Cloudinary og samle URL-ene
  const vedlegg = [];
  for (let i = 0; i < bilder.length; i++) {
    const bilde = bilder[i];
    const formData = new FormData();
    formData.append("file", bilde);
    formData.append("upload_preset", "Avvik"); // Erstatt med din upload preset

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dodljznbo/image/upload", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      vedlegg.push({ url: data.secure_url, name: bilde.name });
    } catch (error) {
      console.error("Feil ved opplasting av bilde:", error);
      alert("Det oppstod en feil ved opplasting av bildene.");
      return;
    }
  }

  // Send e-posten via EmailJS
  emailjs.send("service_9v0o8rb", "template_ymh8tl7", {
    sjofor: sjofor,
    kunde: kunde,
    dato: dato,
    avvik: avvik,
    dynamic_attachments: JSON.stringify(vedlegg)
  })
  .then(function(response) {
    console.log("E-post sendt!", response.status, response.text);
    alert("Avviksrapport sendt!");
    document.getElementById("avviksskjema").reset();
  }, function(error) {
    console.error("Feil ved sending av e-post:", error);
    alert("Det oppstod en feil ved sending av rapporten.");
  });
});
