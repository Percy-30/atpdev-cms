import { CvData, CvTemplateId } from './types';

/**
 * Genera un documento Microsoft Word (.doc) 100% nativo y editable
 * compatible con Microsoft Word, LibreOffice y Google Docs.
 */
export function generateWordHtml(data: CvData, templateId: CvTemplateId): string {
  const { personal, profileSummary, education, courses, experiences, skills, languages } = data;

  const expEspecifica = experiences.filter((e) => e.type === 'Específica');
  const expGeneral = experiences.filter((e) => e.type === 'General');

  let bodyContent = '';

  if (templateId === 'servir-cas') {
    bodyContent = `
      <!-- Encabezado Oficial SERVIR -->
      <div style="text-align: center; border-bottom: 2pt solid #0f172a; padding-bottom: 8pt; margin-bottom: 14pt;">
        <p style="font-size: 8.5pt; font-weight: bold; text-transform: uppercase; color: #475569; margin: 0 0 4pt 0;">
          REPÚBLICA DEL PERÚ — SISTEMA ADMINISTRATIVO DE GESTIÓN DE RECURSOS HUMANOS
        </p>
        <h1 style="font-size: 14pt; font-weight: bold; text-transform: uppercase; margin: 0 0 4pt 0; color: #0f172a;">
          ANEXO: FICHA RESUMEN DE HOJA DE VIDA DEL POSTULANTE
        </h1>
        <p style="font-size: 8.5pt; font-style: italic; color: #475569; margin: 0;">
          Convocatorias para Contratación Administrativa de Servicios (D.L. N° 1057 / Leyes N° 31131, 276 y 728)
        </p>
      </div>

      <!-- I. DATOS PERSONALES -->
      <div style="background-color: #1e293b; color: #ffffff; padding: 4pt 8pt; font-weight: bold; font-size: 9.5pt; text-transform: uppercase; margin-bottom: 4pt;">
        I. DATOS PERSONALES DEL POSTULANTE
      </div>
      <table style="width: 100%; border: none; border-collapse: collapse; margin-bottom: 12pt;">
        <tr>
          <td style="border: none; padding: 0; vertical-align: top;">
            <table style="width: 100%; border-collapse: collapse; border: 1pt solid #cbd5e1; font-size: 9.5pt;">
              <tr>
                <td style="width: 25%; background-color: #f1f5f9; font-weight: bold; border: 1pt solid #cbd5e1; padding: 4pt 6pt;">Nombres y Apellidos:</td>
                <td colspan="3" style="font-weight: bold; border: 1pt solid #cbd5e1; padding: 4pt 6pt; text-transform: uppercase;">${personal.fullName || '—'}</td>
              </tr>
              <tr>
                <td style="width: 25%; background-color: #f1f5f9; font-weight: bold; border: 1pt solid #cbd5e1; padding: 4pt 6pt;">N° DNI / C.E.:</td>
                <td style="width: 25%; border: 1pt solid #cbd5e1; padding: 4pt 6pt;">${personal.dni || '—'}</td>
                <td style="width: 25%; background-color: #f1f5f9; font-weight: bold; border: 1pt solid #cbd5e1; padding: 4pt 6pt;">N° RUC:</td>
                <td style="width: 25%; border: 1pt solid #cbd5e1; padding: 4pt 6pt;">${personal.ruc || '—'}</td>
              </tr>
              <tr>
                <td style="background-color: #f1f5f9; font-weight: bold; border: 1pt solid #cbd5e1; padding: 4pt 6pt;">Teléfono / Celular:</td>
                <td style="border: 1pt solid #cbd5e1; padding: 4pt 6pt;">${personal.phone || '—'}</td>
                <td style="background-color: #f1f5f9; font-weight: bold; border: 1pt solid #cbd5e1; padding: 4pt 6pt;">Correo Electrónico:</td>
                <td style="border: 1pt solid #cbd5e1; padding: 4pt 6pt;">${personal.email || '—'}</td>
              </tr>
              <tr>
                <td style="background-color: #f1f5f9; font-weight: bold; border: 1pt solid #cbd5e1; padding: 4pt 6pt;">Dirección Domiciliaria:</td>
                <td colspan="2" style="border: 1pt solid #cbd5e1; padding: 4pt 6pt;">${personal.address || '—'}</td>
                <td style="border: 1pt solid #cbd5e1; padding: 4pt 6pt;">${personal.city || '—'}</td>
              </tr>
              <tr>
                <td style="background-color: #f1f5f9; font-weight: bold; border: 1pt solid #cbd5e1; padding: 4pt 6pt;">Colegiatura Profesional:</td>
                <td colspan="3" style="border: 1pt solid #cbd5e1; padding: 4pt 6pt;">${personal.colegiatoria || 'No requerida para el cargo / No aplica'}</td>
              </tr>
            </table>
          </td>
          ${
            personal.photoUrl
              ? `
          <td style="border: none; padding: 0 0 0 8pt; width: 85pt; vertical-align: top; text-align: center;">
            <div style="border: 1pt solid #94a3b8; background-color: #f8fafc; padding: 4pt; text-align: center;">
              <img src="${personal.photoUrl}" width="78" height="98" style="object-fit: cover; border: 1pt solid #cbd5e1;" />
              <div style="font-size: 7.5pt; font-family: monospace; font-weight: bold; color: #475569; margin-top: 3pt;">FOTO CARNÉ</div>
            </div>
          </td>`
              : `
          <td style="border: none; padding: 0 0 0 8pt; width: 85pt; vertical-align: top; text-align: center;">
            <div style="border: 1pt dashed #cbd5e1; background-color: #f8fafc; padding: 8pt 4pt; text-align: center;">
              <div style="font-size: 7pt; font-family: monospace; color: #94a3b8; text-transform: uppercase; line-height: 1.3;">
                Espacio Foto<br/><strong style="color: #64748b;">Carné</strong><br/>(Opcional)
              </div>
            </div>
          </td>`
          }
        </tr>
      </table>

      <!-- II. FORMACIÓN ACADÉMICA -->
      <div style="background-color: #1e293b; color: #ffffff; padding: 4pt 8pt; font-weight: bold; font-size: 9.5pt; text-transform: uppercase; margin-bottom: 4pt;">
        II. FORMACIÓN ACADÉMICA (Acreditada según bases de la convocatoria)
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 12pt; border: 1pt solid #cbd5e1; font-size: 9.5pt;">
        <tr style="background-color: #e2e8f0; font-weight: bold; text-align: center;">
          <th style="border: 1pt solid #cbd5e1; padding: 5pt; width: 25%;">Grado / Nivel Académico</th>
          <th style="border: 1pt solid #cbd5e1; padding: 5pt; width: 35%;">Carrera o Especialidad</th>
          <th style="border: 1pt solid #cbd5e1; padding: 5pt; width: 25%;">Universidad / Instituto</th>
          <th style="border: 1pt solid #cbd5e1; padding: 5pt; width: 15%;">Año / Periodo</th>
        </tr>
        ${
          education.length === 0
            ? '<tr><td colspan="4" style="border: 1pt solid #cbd5e1; padding: 8pt; text-align: center; color: #64748b; font-style: italic;">Sin formación académica consignada.</td></tr>'
            : education
                .map(
                  (e) => `
          <tr>
            <td style="border: 1pt solid #cbd5e1; padding: 4pt 6pt; font-weight: bold;">${e.degree}</td>
            <td style="border: 1pt solid #cbd5e1; padding: 4pt 6pt;">${e.carrera}</td>
            <td style="border: 1pt solid #cbd5e1; padding: 4pt 6pt;">${e.institution}</td>
            <td style="border: 1pt solid #cbd5e1; padding: 4pt 6pt; text-align: center;">${e.year}</td>
          </tr>`
                )
                .join('')
        }
      </table>

      <!-- III. CAPACITACIONES Y CURSOS -->
      <div style="background-color: #1e293b; color: #ffffff; padding: 4pt 8pt; font-weight: bold; font-size: 9.5pt; text-transform: uppercase; margin-bottom: 4pt;">
        III. CAPACITACIONES, DIPLOMADOS Y CURSOS DE ESPECIALIZACIÓN (Horas lectivas acreditadas)
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 12pt; border: 1pt solid #cbd5e1; font-size: 9.5pt;">
        <tr style="background-color: #e2e8f0; font-weight: bold; text-align: center;">
          <th style="border: 1pt solid #cbd5e1; padding: 5pt; width: 6%;">N°</th>
          <th style="border: 1pt solid #cbd5e1; padding: 5pt; text-align: left;">Denominación del Curso / Diplomado</th>
          <th style="border: 1pt solid #cbd5e1; padding: 5pt; text-align: left; width: 35%;">Institución Emisora</th>
          <th style="border: 1pt solid #cbd5e1; padding: 5pt; width: 15%;">Horas Lectivas</th>
          <th style="border: 1pt solid #cbd5e1; padding: 5pt; width: 10%;">Año</th>
        </tr>
        ${
          courses.length === 0
            ? '<tr><td colspan="5" style="border: 1pt solid #cbd5e1; padding: 8pt; text-align: center; color: #64748b; font-style: italic;">Sin cursos consignados.</td></tr>'
            : courses
                .map(
                  (c, idx) => `
          <tr>
            <td style="border: 1pt solid #cbd5e1; padding: 4pt 6pt; text-align: center;">${idx + 1}</td>
            <td style="border: 1pt solid #cbd5e1; padding: 4pt 6pt; font-weight: bold;">${c.title}</td>
            <td style="border: 1pt solid #cbd5e1; padding: 4pt 6pt;">${c.inst}</td>
            <td style="border: 1pt solid #cbd5e1; padding: 4pt 6pt; text-align: center; font-weight: bold;">${c.hours}</td>
            <td style="border: 1pt solid #cbd5e1; padding: 4pt 6pt; text-align: center;">${c.year || '—'}</td>
          </tr>`
                )
                .join('')
        }
      </table>

      <!-- IV. EXPERIENCIA LABORAL -->
      <div style="background-color: #1e293b; color: #ffffff; padding: 4pt 8pt; font-weight: bold; font-size: 9.5pt; text-transform: uppercase; margin-bottom: 4pt;">
        IV. EXPERIENCIA LABORAL (General: ${expGeneral.length} reg. | Específica: ${expEspecifica.length} reg.)
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 12pt; border: 1pt solid #cbd5e1; font-size: 9.5pt;">
        <tr style="background-color: #e2e8f0; font-weight: bold; text-align: center;">
          <th style="border: 1pt solid #cbd5e1; padding: 5pt; width: 5%;">N°</th>
          <th style="border: 1pt solid #cbd5e1; padding: 5pt; text-align: left; width: 25%;">Entidad Pública / Empresa</th>
          <th style="border: 1pt solid #cbd5e1; padding: 5pt; text-align: left; width: 22%;">Cargo Desempeñado</th>
          <th style="border: 1pt solid #cbd5e1; padding: 5pt; width: 16%;">Periodo</th>
          <th style="border: 1pt solid #cbd5e1; padding: 5pt; width: 12%;">Tipo</th>
          <th style="border: 1pt solid #cbd5e1; padding: 5pt; text-align: left;">Funciones Principales</th>
        </tr>
        ${
          experiences.length === 0
            ? '<tr><td colspan="6" style="border: 1pt solid #cbd5e1; padding: 8pt; text-align: center; color: #64748b; font-style: italic;">Sin experiencia laboral registrada.</td></tr>'
            : experiences
                .map(
                  (exp, idx) => `
          <tr>
            <td style="border: 1pt solid #cbd5e1; padding: 4pt 6pt; text-align: center;">${idx + 1}</td>
            <td style="border: 1pt solid #cbd5e1; padding: 4pt 6pt; font-weight: bold;">${exp.entity}</td>
            <td style="border: 1pt solid #cbd5e1; padding: 4pt 6pt;">${exp.role}</td>
            <td style="border: 1pt solid #cbd5e1; padding: 4pt 6pt; text-align: center; font-size: 8.5pt;">${exp.period}</td>
            <td style="border: 1pt solid #cbd5e1; padding: 4pt 6pt; text-align: center; font-weight: bold;">${exp.type}</td>
            <td style="border: 1pt solid #cbd5e1; padding: 4pt 6pt; font-size: 9pt;">
              ${exp.functions && exp.functions.length > 0 ? '• ' + exp.functions.join('<br>• ') : 'Funciones asignadas al cargo.'}
            </td>
          </tr>`
                )
                .join('')
        }
      </table>

      <!-- V. DECLARACIÓN JURADA, FIRMA Y HUELLA -->
      <div style="border: 1.5pt solid #64748b; padding: 10pt; background-color: #f8fafc; margin-top: 15pt; font-size: 8.5pt; text-align: justify; line-height: 1.3;">
        <p style="font-weight: bold; text-align: center; text-transform: uppercase; margin: 0 0 6pt 0; font-size: 9pt;">
          DECLARACIÓN JURADA DE VERACIDAD DE LA INFORMACIÓN (TUO LEY N° 27444)
        </p>
        <p style="margin: 0 0 16pt 0;">
          Declaro bajo juramento que la información consignada en la presente Ficha Resumen responde a la verdad y se encuentra sustentada en documentos que obran en mi poder, acogiéndome al Principio de Presunción de Veracidad (Art. IV del Título Preliminar del TUO de la Ley N° 27444).
        </p>

        <!-- Cuadros de Firma y Huella -->
        <table style="width: 100%; border-collapse: collapse; border: none; margin-top: 25pt;">
          <tr>
            <td style="width: 60%; text-align: center; vertical-align: bottom; border: none; padding-right: 20pt;">
              <div style="border-top: 1pt solid #0f172a; padding-top: 5pt; width: 80%; margin: 0 auto;">
                <strong style="text-transform: uppercase; font-size: 9.5pt;">${personal.fullName || 'FIRMA DEL POSTULANTE'}</strong><br>
                <span>DNI / C.E. N° ${personal.dni || '________________'}</span><br>
                <span style="font-size: 8pt; color: #64748b; font-style: italic;">Firma del Postulante</span>
              </div>
            </td>
            <td style="width: 40%; text-align: center; vertical-align: bottom; border: none;">
              <table style="border: 1.5pt dashed #64748b; width: 85pt; height: 100pt; margin: 0 auto; text-align: center;">
                <tr>
                  <td style="border: none; vertical-align: middle; color: #94a3b8; font-size: 7.5pt; font-weight: bold; padding: 4pt;">
                    HUELLA DACTILAR ÍNDICE DERECHO
                  </td>
                </tr>
              </table>
              <span style="font-size: 8pt; color: #64748b; display: block; margin-top: 4pt;">Índice derecho</span>
            </td>
          </tr>
        </table>
      </div>
    `;
  } else {
    // Formato Moderno / Minimalista / Tech adaptable para Word
    bodyContent = `
      <table style="width: 100%; border: none; border-collapse: collapse; border-bottom: 2pt solid #0f172a; padding-bottom: 8pt; margin-bottom: 14pt;">
        <tr>
          <td style="border: none; padding: 0; vertical-align: top;">
            <h1 style="font-size: 20pt; font-weight: bold; color: #0f172a; text-transform: uppercase; margin: 0 0 4pt 0;">
              ${personal.fullName || 'NOMBRES Y APELLIDOS'}
            </h1>
            <p style="font-size: 11pt; font-weight: bold; color: #059669; text-transform: uppercase; margin: 0 0 6pt 0;">
              ${personal.headline || 'PROFESIONAL / ESPECIALISTA'}
            </p>
            <p style="font-size: 9.5pt; color: #475569; margin: 0;">
              ${[personal.city, personal.phone, personal.email, personal.dni ? 'DNI: ' + personal.dni : null, personal.ruc ? 'RUC: ' + personal.ruc : null, personal.linkedin, personal.website].filter(Boolean).join(' • ')}
            </p>
            ${personal.colegiatoria ? `<p style="font-size: 9pt; color: #334155; font-style: italic; margin: 4pt 0 0 0;">${personal.colegiatoria}</p>` : ''}
          </td>
          ${
            personal.photoUrl
              ? `
          <td style="border: none; padding: 0 0 0 12pt; width: 85pt; text-align: right; vertical-align: top;">
            <img src="${personal.photoUrl}" width="78" height="98" style="object-fit: cover; border: 1pt solid #cbd5e1; border-radius: 4pt;" />
          </td>`
              : ''
          }
        </tr>
      </table>

      ${
        profileSummary
          ? `
      <div style="margin-bottom: 14pt;">
        <h2 style="font-size: 11.5pt; font-weight: bold; color: #0f172a; border-bottom: 1pt solid #cbd5e1; padding-bottom: 3pt; text-transform: uppercase; margin-bottom: 6pt;">
          Perfil Profesional
        </h2>
        <p style="font-size: 10pt; color: #334155; text-align: justify; line-height: 1.4; margin: 0;">
          ${profileSummary}
        </p>
      </div>`
          : ''
      }

      <!-- Experiencia Laboral -->
      <div style="margin-bottom: 14pt;">
        <h2 style="font-size: 11.5pt; font-weight: bold; color: #0f172a; border-bottom: 1pt solid #cbd5e1; padding-bottom: 3pt; text-transform: uppercase; margin-bottom: 8pt;">
          Experiencia Laboral
        </h2>
        ${experiences
          .map(
            (exp) => `
        <div style="margin-bottom: 10pt;">
          <table style="width: 100%; border: none; border-collapse: collapse; margin-bottom: 2pt;">
            <tr>
              <td style="border: none; padding: 0; font-weight: bold; font-size: 10.5pt; color: #0f172a;">
                ${exp.role} — <span style="font-weight: normal; color: #334155;">${exp.entity}</span>
              </td>
              <td style="border: none; padding: 0; text-align: right; font-size: 9pt; color: #64748b;">
                ${exp.period}
              </td>
            </tr>
          </table>
          ${exp.type ? `<div style="font-size: 8.5pt; color: #059669; font-weight: bold; margin-bottom: 3pt;">Modalidad: Experiencia ${exp.type}</div>` : ''}
          ${
            exp.functions && exp.functions.length > 0
              ? `<ul style="margin: 3pt 0 0 15pt; padding: 0; font-size: 9.5pt; color: #334155;">
                  ${exp.functions.map((f) => `<li style="margin-bottom: 2pt;">${f}</li>`).join('')}
                 </ul>`
              : ''
          }
        </div>`
          )
          .join('')}
      </div>

      <!-- Formación Académica -->
      <div style="margin-bottom: 14pt;">
        <h2 style="font-size: 11.5pt; font-weight: bold; color: #0f172a; border-bottom: 1pt solid #cbd5e1; padding-bottom: 3pt; text-transform: uppercase; margin-bottom: 8pt;">
          Formación Académica
        </h2>
        ${education
          .map(
            (edu) => `
        <table style="width: 100%; border: none; border-collapse: collapse; margin-bottom: 6pt;">
          <tr>
            <td style="border: none; padding: 0; font-weight: bold; font-size: 10pt; color: #0f172a;">
              ${edu.degree}: ${edu.carrera}
              <div style="font-weight: normal; font-size: 9pt; color: #475569;">${edu.institution} ${edu.status ? '• ' + edu.status : ''}</div>
            </td>
            <td style="border: none; padding: 0; text-align: right; font-size: 9pt; color: #64748b; vertical-align: top;">
              ${edu.year}
            </td>
          </tr>
        </table>`
          )
          .join('')}
      </div>

      <!-- Capacitaciones y Cursos -->
      ${
        courses && courses.length > 0
          ? `
      <div style="margin-bottom: 14pt;">
        <h2 style="font-size: 11.5pt; font-weight: bold; color: #0f172a; border-bottom: 1pt solid #cbd5e1; padding-bottom: 3pt; text-transform: uppercase; margin-bottom: 6pt;">
          Cursos de Especialización & Certificaciones
        </h2>
        ${courses
          .map(
            (c) => `
        <table style="width: 100%; border: none; border-collapse: collapse; margin-bottom: 4pt; font-size: 9.5pt;">
          <tr>
            <td style="border: none; padding: 0;">
              <strong>${c.title}</strong> — <span style="color: #475569;">${c.inst}</span>
            </td>
            <td style="border: none; padding: 0; text-align: right; font-size: 9pt; font-weight: bold; color: #059669;">
              ${c.hours} ${c.year ? `(${c.year})` : ''}
            </td>
          </tr>
        </table>`
          )
          .join('')}
      </div>`
          : ''
      }

      <!-- Habilidades e Idiomas -->
      <div style="margin-bottom: 14pt;">
        <h2 style="font-size: 11.5pt; font-weight: bold; color: #0f172a; border-bottom: 1pt solid #cbd5e1; padding-bottom: 3pt; text-transform: uppercase; margin-bottom: 6pt;">
          Competencias & Idiomas
        </h2>
        ${skills && skills.length > 0 ? `<p style="font-size: 9.5pt; color: #334155; margin: 0 0 4pt 0;"><strong>Competencias Clave:</strong> ${skills.join(', ')}.</p>` : ''}
        ${languages && languages.length > 0 ? `<p style="font-size: 9.5pt; color: #334155; margin: 0;"><strong>Idiomas:</strong> ${languages.map((l) => `${l.name} (${l.level})`).join(', ')}.</p>` : ''}
      </div>
    `;
  }

  return `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<title>${data.personal.fullName || 'Curriculum Vitae'} - Chamba Pro</title>
<!--[if gte mso 9]>
<xml>
<w:WordDocument>
<w:View>Print</w:View>
<w:Zoom>100</w:Zoom>
<w:DoNotOptimizeForBrowser/>
</w:WordDocument>
</xml>
<![endif]-->
<style>
@page Section1 {
  size: 595.3pt 841.9pt; /* A4 standard: 21.0cm x 29.7cm */
  margin: 1.8cm 1.8cm 1.8cm 1.8cm;
  mso-header-margin: 36.0pt;
  mso-footer-margin: 36.0pt;
  mso-paper-source: 0;
}
div.Section1 { page: Section1; }
body {
  font-family: 'Calibri', 'Arial', 'Segoe UI', sans-serif;
  font-size: 10pt;
  color: #1e293b;
  line-height: 1.25;
}
p { margin: 0 0 4pt 0; }
</style>
</head>
<body>
<div class="Section1">
${bodyContent}
</div>
</body>
</html>
`;
}

/**
 * Disparador de descarga de archivo .doc (Word)
 */
export function downloadCvAsWord(data: CvData, templateId: CvTemplateId) {
  const content = generateWordHtml(data, templateId);
  const blob = new Blob(['\ufeff' + content], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;

  const cleanName = (data.personal.fullName || 'POSTULANTE')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .toUpperCase();

  a.download = `CV_${cleanName}_${data.personal.dni || 'EDITABLE'}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
