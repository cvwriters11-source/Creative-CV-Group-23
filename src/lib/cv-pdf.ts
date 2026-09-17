import { jsPDF } from "jspdf";
import { buildCvDocument, cvLayout } from "@/lib/cv-document";
import type { GeneratorDraft } from "@/lib/generator";

const PAGE_W = cvLayout.pageWidthMm;
const PAGE_H = cvLayout.pageHeightMm;
const MX = cvLayout.marginXMm;
const MY = cvLayout.marginYMm;
const CONTENT_W = PAGE_W - MX * 2;

type FontName = "times" | "helvetica";
type FontStyle = "normal" | "bold";

function fileNameFor(name: string) {
  const slug = name
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  return `${slug || "Creative-CV"}-CV.pdf`;
}

function ptToMm(pt: number) {
  return pt * 0.352778;
}

export function createCvPdf(draft: GeneratorDraft) {
  const model = buildCvDocument(draft);
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  let y = MY;

  const ensure = (neededMm: number) => {
    if (y + neededMm > PAGE_H - MY) {
      doc.addPage();
      y = MY;
    }
  };

  const setType = (font: FontName, style: FontStyle, sizePt: number) => {
    doc.setFont(font, style);
    doc.setFontSize(sizePt);
    doc.setTextColor(0, 0, 0);
  };

  const lineHeight = (sizePt: number) => ptToMm(sizePt) * cvLayout.lineHeight;

  const writeWrapped = (
    text: string,
    opts: { font?: FontName; style?: FontStyle; size?: number; indent?: number },
  ) => {
    const font = opts.font ?? "helvetica";
    const style = opts.style ?? "normal";
    const size = opts.size ?? cvLayout.bodySizePt;
    const indent = opts.indent ?? 0;
    const width = CONTENT_W - indent;
    setType(font, style, size);
    const rows = doc.splitTextToSize(text, width) as string[];
    const lh = lineHeight(size);
    for (const row of rows) {
      ensure(lh);
      doc.text(row, MX + indent, y, {
        align: "left",
        maxWidth: width,
      });
      y += lh;
    }
  };

  const heading = (label: string) => {
    const size = cvLayout.headingSizePt;
    const lh = lineHeight(size) + 1.2;
    y += 2.4;
    ensure(lh + 1);
    setType("helvetica", "bold", size);
    doc.text(label, MX, y);
    y += 1.1;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.28);
    doc.line(MX, y, PAGE_W - MX, y);
    y += 3.2;
  };

  const bulletList = (items: string[], columns = 1) => {
    if (!items.length) return;
    const size = cvLayout.bodySizePt;
    const lh = lineHeight(size);
    const bulletIndent = 4.2;
    const textIndent = 6.4;

    if (columns === 1) {
      for (const item of items) {
        const rows = doc.splitTextToSize(item, CONTENT_W - textIndent) as string[];
        ensure(lh * rows.length);
        setType("helvetica", "normal", size);
        doc.text("•", MX + 1.2, y);
        rows.forEach((row, index) => {
          if (index > 0) ensure(lh);
          doc.text(row, MX + textIndent, y);
          y += lh;
        });
      }
      return;
    }

    const splitAt = Math.ceil(items.length / 2);
    const leftItems = items.slice(0, splitAt);
    const rightItems = items.slice(splitAt);
    const colW = (CONTENT_W - 6) / 2;
    ensure(lh * Math.max(leftItems.length, rightItems.length, 1));
    const startY = y;
    const writeColumn = (columnItems: string[], x: number) => {
      let cursor = startY;
      setType("helvetica", "normal", size);
      for (const item of columnItems) {
        const rows = doc.splitTextToSize(item, colW - (textIndent - bulletIndent)) as string[];
        const height = lh * rows.length;
        if (cursor + height > PAGE_H - MY) {
          doc.addPage();
          cursor = MY;
        }
        doc.text("•", x + 1.2, cursor);
        rows.forEach((row, index) => {
          doc.text(row, x + textIndent - bulletIndent + 2.2, cursor + index * lh);
        });
        cursor += height;
      }
      return cursor;
    };
    const leftEnd = writeColumn(leftItems, MX);
    const rightEnd = writeColumn(rightItems, MX + colW + 6);
    y = Math.max(leftEnd, rightEnd);
  };

  const writePlainLines = (items: string[]) => {
    for (const item of items) writeWrapped(item, {});
  };

  setType("times", "bold", cvLayout.nameSizePt);
  const nameLh = lineHeight(cvLayout.nameSizePt);
  ensure(nameLh);
  doc.text(model.fullName.toUpperCase(), PAGE_W / 2, y, { align: "center" });
  y += nameLh + 0.4;

  setType("helvetica", "bold", cvLayout.headlineSizePt);
  const titleLh = lineHeight(cvLayout.headlineSizePt);
  ensure(titleLh);
  doc.text(model.headline.toUpperCase(), PAGE_W / 2, y, { align: "center" });
  y += titleLh + 0.2;

  setType("helvetica", "normal", cvLayout.contactSizePt);
  const contactRows = doc.splitTextToSize(model.contact, CONTENT_W) as string[];
  const contactLh = lineHeight(cvLayout.contactSizePt);
  for (const row of contactRows) {
    ensure(contactLh);
    doc.text(row, PAGE_W / 2, y, { align: "center" });
    y += contactLh;
  }

  if (model.languages) {
    ensure(contactLh);
    doc.text(model.languages, PAGE_W / 2, y, { align: "center" });
    y += contactLh;
  }

  if (model.summary) {
    heading("PERSONAL SUMMARY");
    writeWrapped(model.summary, {});
  }

  if (model.education.length) {
    heading("Education");
    writePlainLines(model.education);
  }

  if (model.skills.length) {
    heading("Key Skills");
    bulletList(model.skills, 2);
  }

  if (model.experience.length) {
    heading("Professional Experience");
    for (const role of model.experience) {
      const size = cvLayout.bodySizePt;
      const lh = lineHeight(size);
      ensure(lh * 2 + 2);
      setType("helvetica", "bold", size);
      const dateWidth = role.dates ? doc.getTextWidth(role.dates) + 2 : 0;
      const companyWidth = CONTENT_W - dateWidth - 2;
      const companyRows = doc.splitTextToSize(role.companyLine, Math.max(companyWidth, 40)) as string[];
      companyRows.forEach((row, index) => {
        ensure(lh);
        doc.text(row, MX, y);
        if (index === 0 && role.dates) {
          doc.text(role.dates, PAGE_W - MX, y, { align: "right" });
        }
        y += lh;
      });
      if (role.title) {
        ensure(lh);
        doc.text(role.title, MX, y);
        y += lh;
      }
      if (role.intro) writeWrapped(role.intro, {});
      bulletList(role.bullets);
      y += 1.1;
    }
  }

  if (model.affiliations.length) {
    heading("Professional Affiliations");
    writePlainLines(model.affiliations);
  }

  if (model.development.length) {
    heading("Professional Development");
    writePlainLines(model.development);
  }

  if (model.awards.length) {
    heading("Awards and Accomplishments");
    writePlainLines(model.awards);
  }

  if (model.showReferencesHeading) {
    heading("REFERENCES");
    bulletList(model.references);
  }

  return doc;
}

export function downloadCvPdf(draft: GeneratorDraft) {
  const doc = createCvPdf(draft);
  doc.save(fileNameFor(draft.fullName));
}
