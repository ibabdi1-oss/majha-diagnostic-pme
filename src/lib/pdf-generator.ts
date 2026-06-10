import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export async function generatePremiumPdf(containerId: string, filename: string): Promise<boolean> {
  try {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Générateur PDF: Conteneur #${containerId} introuvable dans le DOM.`);
      return false;
    }

    console.log("Démarrage de la génération du PDF Premium MAJHA...");
    
    // Récupérer toutes les pages
    const pages = container.querySelectorAll(".pdf-page");
    if (pages.length === 0) {
      console.error("Générateur PDF: Aucune page avec la classe .pdf-page trouvée.");
      return false;
    }

    // A4 dimensions at 72 DPI (Standard PDF points): 595.28 x 841.89 points (210 x 297 mm)
    // jsPDF uses mm by default for layout positioning if initialized so
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i] as HTMLElement;
      
      // Temporairement forcer l'affichage si la page est cachée
      const originalStyleDisplay = page.style.display;
      page.style.display = "block";

      console.log(`Rendu de la page ${i + 1}/${pages.length} en cours...`);

      const canvas = await html2canvas(page, {
        scale: 2, // Augmente la résolution pour une netteté d'impression optimale
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: null // Conserver la transparence du fond si besoin
      } as any);

      // Restaurer le style d'affichage original
      page.style.display = originalStyleDisplay;

      const imgData = canvas.toDataURL("image/jpeg", 0.95);

      if (i > 0) {
        pdf.addPage();
      }

      // Dessiner l'image en pleine page
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
    }

    // Enregistrer le fichier
    pdf.save(filename);
    console.log("PDF Premium généré et téléchargé avec succès.");
    return true;
  } catch (err) {
    console.error("Erreur critique lors de la génération du PDF :", err);
    return false;
  }
}
