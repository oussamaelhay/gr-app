import jsPDF from 'jspdf';
import type { DemandeConge, DemandeAttestation } from '../types';

// ── Page & conversion constants ──────────────────────────────────────────────
const DXA        = 0.017639;          // 1 DXA → mm  (25.4 / 1440)
const PAGE_W_DXA = 11906;
const PAGE_H_DXA = 16838;
const PAGE_W     = PAGE_W_DXA * DXA;  // ≈ 210 mm
const MARGIN_L   = 1417 * DXA;        // ≈ 25.0 mm  (left/right)
const MARGIN_T   = 567  * DXA;        // ≈ 10.0 mm  (top/bottom)
const CONTENT_W  = PAGE_W - MARGIN_L * 2; // ≈ 160 mm

// ── Bordereau table dimensions (from Bordereau_congé_DRH.docx) ───────────────
const TBL_INDENT  = -754  * DXA;      // table indent  ≈ -13.3 mm
const TBL_W       = 10747 * DXA;      // total width   ≈ 189.6 mm
const TBL_COL1    = 5245  * DXA;      // Désignation   ≈  92.5 mm
const TBL_COL2    = 1276  * DXA;      // Nombre        ≈  22.5 mm
const TBL_COL3    = 4226  * DXA;      // Observations  ≈  74.5 mm
const TBL_HDR_H   = 771   * DXA;      // header row    ≈  13.6 mm
const TBL_ROW_H   = 9256  * DXA;      // body row      ≈ 163.3 mm
const TBL_X       = MARGIN_L + TBL_INDENT; // left edge of table

// ── Border line widths ────────────────────────────────────────────────────────
const LW_OUTER  = 1.05;   // thinThickSmallGap sz:24 ≈ 3 pt
const LW_INNER  = 0.18;   // double            sz:4  ≈ 0.5 pt

function addHeaderWithCinPpr(doc: jsPDF, y: number, cin: string, ppr: string): number {
  const startY = y;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('ROYAUME DU MAROC', MARGIN_L, y); y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.text("Ministère de l'Intérieur", MARGIN_L, y); y += 4.5;
  doc.text('Direction Générale des Affaires Intérieures', MARGIN_L, y); y += 4.5;
  doc.text('Direction de la Sécurité et de la Documentation', MARGIN_L, y); y += 4.5;
  doc.text('Division de la Sécurité des Bâtiments et des Documents', MARGIN_L, y);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('C.I.N: ' + cin, PAGE_W - MARGIN_L, startY + 4, { align: 'right' });
  doc.text('P.P.R: ' + ppr, PAGE_W - MARGIN_L, startY + 10, { align: 'right' });
  y += 8;
  return y;
}

function addSimpleHeader(doc: jsPDF, y: number): number {
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('ROYAUME DU MAROC', MARGIN_L, y); y += 5;
  doc.text("MINISTERE DE L'INTERIEUR", MARGIN_L, y); y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Direction Générale des Affaires Intérieures', MARGIN_L, y); y += 4.5;
  doc.text('Direction de la Sécurité et de la Documentation', MARGIN_L, y); y += 4.5;
  doc.setFont('helvetica', 'italic');
  doc.text('Division de la Sécurité des Bâtiments et des Documents', MARGIN_L, y);
  doc.setFont('helvetica', 'normal');
  y += 10;
  return y;
}

function drawCongeExemplaire(doc: jsPDF, data: DemandeConge, startY: number): number {
  let y = startY;
  y = addHeaderWithCinPpr(doc, y, data.cin, data.ppr);
  y += 6;
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('DEMANDE DE CONGE', PAGE_W / 2, y, { align: 'center' });
  y += 5;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text("Pour l'année : " + data.annee, PAGE_W / 2, y, { align: 'center' });
  y += 8;
  doc.setFontSize(9.5);
  doc.setTextColor(0, 0, 0);
  doc.text('Prénom : ' + data.prenom, MARGIN_L, y);
  doc.text('Nom : ' + data.nom, PAGE_W / 2, y);
  y += 6;
  doc.text('Grade : ' + data.grade, MARGIN_L, y);
  y += 6;
  doc.text("Poste d'affectation : " + data.posteAffectation, MARGIN_L, y);
  y += 6;
  doc.text('Date de départ en congé : ' + data.dateDepart, MARGIN_L, y);
  if (data.duree) doc.text('Durée du congé sollicité : ' + data.duree + ' Jours', PAGE_W / 2, y);
  y += 6;
  doc.text('Résidence pendant le congé (Adresse Complète) :', MARGIN_L, y);
  y += 5;
  if (data.residencePendantConge) {
    doc.text(data.residencePendantConge, MARGIN_L + 4, y);
    y += 5;
  }
  doc.text('Tél. : ' + data.telephone, MARGIN_L, y);
  y += 6;
  doc.text('Observations : ', MARGIN_L, y);
  doc.setFont('helvetica', 'bold');
  doc.text("Congé administratif au titre de l'année " + data.annee, MARGIN_L + 28, y);
  doc.setFont('helvetica', 'normal');
  y += 10;
  const boxX = MARGIN_L, boxW = 110, boxH = 22;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.rect(boxX, y, boxW, boxH);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Avis et Signature du Responsable Hiérarchique', boxX + boxW / 2, y + 6, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text('Rabat, le ' + data.dateSignature, PAGE_W - MARGIN_L, y + 6, { align: 'right' });
  doc.text("(Signature de l'intéressé)", PAGE_W - MARGIN_L, y + 12, { align: 'right' });
  y += boxH + 6;
  return y;
}

export function generateDemandeConge(data: DemandeConge): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  let y = MARGIN_T;
  y = drawCongeExemplaire(doc, data, y);
  y += 4;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.4);
  doc.setLineDash([3, 2]);
  doc.line(MARGIN_L, y, PAGE_W - MARGIN_L, y);
  doc.setLineDash([]);
  y += 8;
  drawCongeExemplaire(doc, data, y);
  doc.save('Demande_Conge_' + data.nom + '_' + data.prenom + '.pdf');
}

function drawBordereauTable(
  doc: jsPDF,
  y: number,
  designationLine1: string,
  nomComplet: string,
  grade: string,
  obsLine1: string
): void {
  // ── Outer thick border (thinThickSmallGap) ────────────────────────────────
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(LW_OUTER);
  doc.rect(TBL_X, y, TBL_W, TBL_HDR_H + TBL_ROW_H);

  // ── Inner thin lines ──────────────────────────────────────────────────────
  doc.setLineWidth(LW_INNER);

  // Horizontal separator between header and body row
  doc.line(TBL_X, y + TBL_HDR_H, TBL_X + TBL_W, y + TBL_HDR_H);

  // Vertical separators (full height)
  doc.line(TBL_X + TBL_COL1, y, TBL_X + TBL_COL1, y + TBL_HDR_H + TBL_ROW_H);
  doc.line(TBL_X + TBL_COL1 + TBL_COL2, y, TBL_X + TBL_COL1 + TBL_COL2, y + TBL_HDR_H + TBL_ROW_H);

  // ── Header row text ───────────────────────────────────────────────────────
  const hdrMidY = y + TBL_HDR_H / 2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text('Désignation des pièces',
    TBL_X + TBL_COL1 / 2, hdrMidY,
    { align: 'center', baseline: 'middle' });
  doc.text('Nombre',
    TBL_X + TBL_COL1 + TBL_COL2 / 2, hdrMidY,
    { align: 'center', baseline: 'middle' });
  doc.text('Observations',
    TBL_X + TBL_COL1 + TBL_COL2 + TBL_COL3 / 2, hdrMidY,
    { align: 'center', baseline: 'middle' });

  // ── Body row — Col 1 : Désignation ────────────────────────────────────────
  const rowY    = y + TBL_HDR_H;
  const cellPad = 4; // mm inner padding

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  // Centered intro line
  doc.text(
    designationLine1,
    TBL_X + TBL_COL1 / 2,
    rowY + 10,
    { align: 'center' }
  );

  // Bold underlined name
  const nomLine = 'Mme ' + nomComplet + ',';
  const nomX    = TBL_X + cellPad;
  const nomY    = rowY + 18;
  doc.setFont('helvetica', 'bold');
  doc.text(nomLine, nomX, nomY);
  const nomTextW = doc.getTextWidth(nomLine);
  doc.setLineWidth(0.3);
  doc.line(nomX, nomY + 1, nomX + nomTextW, nomY + 1);

  // Grade + direction lines
  doc.setFont('helvetica', 'normal');
  doc.text(grade + ',', nomX, rowY + 25);
  doc.text('relevant de cette Direction.', nomX, rowY + 32);

  // ── Body row — Col 3 : Observations ──────────────────────────────────────
  doc.setFontSize(9.5);
  const obsX     = TBL_X + TBL_COL1 + TBL_COL2 + cellPad;
  const obsLines = [
    obsLine1,
    'transmettre la demande désignée',
    'ci-contre avec avis favorable\u00a0» ./.',
  ];
  obsLines.forEach((line, i) => {
    doc.text(line, obsX, rowY + 10 + i * 6);
  });
}

export function generateBordereauConge(data: DemandeConge): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  let y = MARGIN_T;

  y = addSimpleHeader(doc, y);
  y += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text('A', PAGE_W / 2, y, { align: 'center' });
  y += 10;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Monsieur le Directeur des Ressources Humaines', PAGE_W / 2, y, { align: 'center' });
  y += 14;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text("Bordereau d'Envoi", PAGE_W / 2, y, { align: 'center' });
  y += 10;

  const nomComplet = (data.prenom + ' ' + data.nom).toUpperCase();

  drawBordereauTable(
    doc,
    y,
    'Demande de congé formulée par',
    nomComplet,
    data.grade,
    '\u00ab\u00a0En ayant l\u2019honneur de vous'
  );

  doc.save('Bordereau_Envoi_' + data.nom + '_' + data.prenom + '.pdf');
}

export function generateAttestationTravail(data: DemandeAttestation): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  let y = MARGIN_T;

  y = addSimpleHeader(doc, y);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text('Réf : ........./DRH/' + new Date().getFullYear(), MARGIN_L, y);
  y += 8;

  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('ATTESTATION DE TRAVAIL', PAGE_W / 2, y, { align: 'center' });
  y += 4;
  doc.setDrawColor(0);
  doc.setLineWidth(0.6);
  doc.line(PAGE_W / 2 - 38, y, PAGE_W / 2 + 38, y);
  y += 12;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(
    "Je soussigné, le Directeur des Ressources Humaines du Ministère de l'Intérieur, atteste que :",
    MARGIN_L, y, { maxWidth: CONTENT_W }
  );
  y += 10;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(
    'M./Mme ' + data.prenom.toUpperCase() + ' ' + data.nom.toUpperCase(),
    PAGE_W / 2, y, { align: 'center' }
  );
  y += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const bodyLines = [
    'Titulaire de la C.I.N : ' + data.cin + '  —  P.P.R : ' + data.ppr,
    'Grade : ' + data.grade,
    "Poste d'affectation : " + data.posteAffectation,
    'est bien agent de notre Administration depuis le ' + data.dateEmbauche + '.',
    '',
    "La présente attestation est délivrée à l'intéressé(e) pour servir et valoir ce que de droit.",
  ];
  bodyLines.forEach(line => {
    if (line === '') { y += 4; return; }
    const wrapped = doc.splitTextToSize(line, CONTENT_W);
    doc.text(wrapped, MARGIN_L, y);
    y += wrapped.length * 6;
  });

  if (data.motif) {
    y += 4;
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(80, 80, 80);
    doc.text('Motif de la demande : ' + data.motif, MARGIN_L, y, { maxWidth: CONTENT_W });
    y += 8;
  }

  y += 10;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text('Rabat, le ' + data.dateSignature, PAGE_W - MARGIN_L, y, { align: 'right' });
  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('Le Directeur des Ressources Humaines', PAGE_W - MARGIN_L, y, { align: 'right' });
  y += 20;

  doc.setDrawColor(0);
  doc.setLineWidth(0.4);
  doc.rect(PAGE_W - MARGIN_L - 70, y, 70, 24);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text('Cachet et Signature', PAGE_W - MARGIN_L - 35, y + 12, { align: 'center' });

  doc.save('Attestation_Travail_' + data.nom + '_' + data.prenom + '.pdf');
}

export function generateBordereauAttestation(data: DemandeAttestation): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  let y = MARGIN_T;

  y = addSimpleHeader(doc, y);
  y += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text('A', PAGE_W / 2, y, { align: 'center' });
  y += 10;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Monsieur le Directeur des Ressources Humaines', PAGE_W / 2, y, { align: 'center' });
  y += 14;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text("Bordereau d'Envoi", PAGE_W / 2, y, { align: 'center' });
  y += 10;

  const nomComplet = (data.prenom + ' ' + data.nom).toUpperCase();

  drawBordereauTable(
    doc,
    y,
    "Demande d'attestation de travail formulée par",
    nomComplet,
    data.grade,
    '\u00ab\u00a0En ayant l\u2019honneur de vous'
  );

  doc.save('Bordereau_Attestation_' + data.nom + '_' + data.prenom + '.pdf');
}