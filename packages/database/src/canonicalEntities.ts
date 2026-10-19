/**
 * Directorio Canónico de Portales Oficiales de Convocatorias del Estado Peruano
 * Mapea entidades del Estado a sus secciones exactas de convocatorias institucionales
 * para erradicar el fallback a portadas genéricas (ej: www.gob.pe/servir).
 */

export interface CanonicalEntityInfo {
  name: string;
  shortName: string;
  convocatoriasUrl: string;
  portalName: string;
  officialRuc?: string;
  searchPattern?: string;
}

export const CANONICAL_ENTITIES: CanonicalEntityInfo[] = [
  // Poderes del Estado y Órganos Constitucionales
  {
    name: 'PRESIDENCIA DEL CONSEJO DE MINISTROS',
    shortName: 'PCM',
    convocatoriasUrl: 'https://www.gob.pe/institucion/pcm/colecciones/3618-convocatorias-de-trabajo-cas',
    portalName: 'PCM - Portal Oficial de Convocatorias CAS',
    officialRuc: '20168999926',
    searchPattern: 'pcm OR "consejo de ministros"'
  },
  {
    name: 'PODER JUDICIAL DEL PERÚ',
    shortName: 'PODER JUDICIAL',
    convocatoriasUrl: 'https://aplicativo.pj.gob.pe/psep/',
    portalName: 'Poder Judicial - Sistema PSEP de Convocatorias',
    officialRuc: '20159981216',
    searchPattern: '"poder judicial" OR "corte superior"'
  },
  {
    name: 'MINISTERIO PÚBLICO - FISCALÍA DE LA NACIÓN',
    shortName: 'FISCALÍA',
    convocatoriasUrl: 'https://portal.mpfn.gob.pe/convocatorias',
    portalName: 'Ministerio Público - Portal de Convocatorias MPFN',
    officialRuc: '20131370301',
    searchPattern: '"ministerio publico" OR "fiscalia de la nacion" OR mpfn'
  },
  {
    name: 'CONGRESO DE LA REPÚBLICA',
    shortName: 'CONGRESO',
    convocatoriasUrl: 'https://www.congreso.gob.pe/convocatorias-cas/',
    portalName: 'Congreso de la República - Convocatorias CAS',
    officialRuc: '20161749126',
    searchPattern: '"congreso de la republica"'
  },
  {
    name: 'DEFENSORÍA DEL PUEBLO',
    shortName: 'DEFENSORÍA',
    convocatoriasUrl: 'https://www.defensoria.gob.pe/convocatorias-cas/',
    portalName: 'Defensoría del Pueblo - Portal de Convocatorias CAS',
    officialRuc: '20304117142',
    searchPattern: '"defensoria del pueblo"'
  },
  {
    name: 'CONTRALORÍA GENERAL DE LA REPÚBLICA',
    shortName: 'CONTRALORÍA',
    convocatoriasUrl: 'https://www.gob.pe/institucion/contraloria/colecciones/183-convocatorias-de-trabajo-cas',
    portalName: 'Contraloría General - Convocatorias de Trabajo',
    officialRuc: '20131378972',
    searchPattern: 'contraloria'
  },
  {
    name: 'INSTITUTO NACIONAL DE ESTADÍSTICA E INFORMÁTICA',
    shortName: 'INEI',
    convocatoriasUrl: 'https://uneteservicios.inei.gob.pe/',
    portalName: 'INEI - Sistema Únete Servicios y Convocatorias',
    officialRuc: '20131369982',
    searchPattern: 'inei OR "instituto nacional de estadistica e informatica"'
  },

  // Sistema Electoral
  {
    name: 'OFICINA NACIONAL DE PROCESOS ELECTORALES',
    shortName: 'ONPE',
    convocatoriasUrl: 'https://reclutamiento.onpe.gob.pe/convocatorias',
    portalName: 'ONPE - Sistema de Reclutamiento y Selección',
    officialRuc: '20291973851',
    searchPattern: 'onpe'
  },
  {
    name: 'REGISTRO NACIONAL DE IDENTIFICACIÓN Y ESTADO CIVIL',
    shortName: 'RENIEC',
    convocatoriasUrl: 'https://apps.reniec.gob.pe/convocaWeb/',
    portalName: 'RENIEC - Portal de Convocatorias de Personal',
    officialRuc: '20295613620',
    searchPattern: 'reniec'
  },
  {
    name: 'JURADO NACIONAL DE ELECCIONES',
    shortName: 'JNE',
    convocatoriasUrl: 'https://seleccionpersonal.jne.gob.pe/',
    portalName: 'JNE - Sistema de Selección de Personal',
    officialRuc: '20134444551',
    searchPattern: 'jne OR "jurado nacional de elecciones"'
  },

  // Organismos Tributarios y Financieros
  {
    name: 'SUPERINTENDENCIA NACIONAL DE ADUANAS Y DE ADMINISTRACIÓN TRIBUTARIA',
    shortName: 'SUNAT',
    convocatoriasUrl: 'https://unete.sunat.gob.pe/',
    portalName: 'SUNAT - Únete a SUNAT Convocatorias',
    officialRuc: '20131312955',
    searchPattern: 'sunat'
  },
  {
    name: 'BANCO CENTRAL DE RESERVA DEL PERÚ',
    shortName: 'BCRP',
    convocatoriasUrl: 'https://bcrp.hiringroom.com/jobs',
    portalName: 'BCRP - Convocatorias Laborales Oficiales',
    officialRuc: '20131377810',
    searchPattern: 'bcrp'
  },
  {
    name: 'BANCO DE LA NACIÓN',
    shortName: 'BANCO DE LA NACIÓN',
    convocatoriasUrl: 'https://www.bn.com.pe/oportunidad-laboral/',
    portalName: 'Banco de la Nación - Oportunidad Laboral',
    officialRuc: '20100030595',
    searchPattern: '"banco de la nacion"'
  },
  {
    name: 'SUPERINTENDENCIA DE BANCA, SEGUROS Y AFP',
    shortName: 'SBS',
    convocatoriasUrl: 'https://www.sbs.gob.pe/trabaja-en-la-sbs',
    portalName: 'SBS - Trabaja en la SBS',
    officialRuc: '20131379782',
    searchPattern: 'sbs OR "banca, seguros y afp"'
  },

  // Salud y Seguridad Social
  {
    name: 'SEGURO SOCIAL DE SALUD',
    shortName: 'ESSALUD',
    convocatoriasUrl: 'https://convocatorias.essalud.gob.pe/',
    portalName: 'EsSalud - Sistema Oficial de Convocatorias de Personal',
    officialRuc: '20131257750',
    searchPattern: 'essalud'
  },
  {
    name: 'MINISTERIO DE SALUD',
    shortName: 'MINSA',
    convocatoriasUrl: 'https://www.gob.pe/institucion/minsa/colecciones/185-convocatorias-de-trabajo',
    portalName: 'MINSA - Convocatorias de Trabajo CAS',
    officialRuc: '20131372931',
    searchPattern: 'minsa'
  },
  {
    name: 'SEGURO INTEGRAL DE SALUD',
    shortName: 'SIS',
    convocatoriasUrl: 'https://www.gob.pe/institucion/sis/colecciones/229-convocatorias-de-trabajo-cas',
    portalName: 'SIS - Convocatorias de Trabajo CAS',
    officialRuc: '20504798127',
    searchPattern: 'sis OR "seguro integral de salud"'
  },
  {
    name: 'INSTITUTO NACIONAL DE SALUD',
    shortName: 'INS',
    convocatoriasUrl: 'https://web.ins.gob.pe/es/convocatorias',
    portalName: 'INS - Convocatorias de Personal',
    officialRuc: '20131373580',
    searchPattern: '"instituto nacional de salud"'
  },

  // Ministerios Principales
  {
    name: 'MINISTERIO DE EDUCACIÓN',
    shortName: 'MINEDU',
    convocatoriasUrl: 'https://postulacioncas.minedu.gob.pe/PostulacionCas/',
    portalName: 'MINEDU - Sistema de Postulación CAS en Línea',
    officialRuc: '20131370998',
    searchPattern: 'minedu OR "postulacioncas.minedu.gob.pe"'
  },
  {
    name: 'MINISTERIO DE ECONOMÍA Y FINANZAS',
    shortName: 'MEF',
    convocatoriasUrl: 'https://www.gob.pe/institucion/mef/colecciones/182-convocatorias-de-trabajo-cas-y-fag',
    portalName: 'MEF - Convocatorias de Trabajo CAS y FAG',
    officialRuc: '20131370645',
    searchPattern: 'mef'
  },
  {
    name: 'MINISTERIO DEL INTERIOR',
    shortName: 'MININTER',
    convocatoriasUrl: 'https://www.gob.pe/institucion/mininter/colecciones/284-convocatorias-de-trabajo',
    portalName: 'MININTER - Convocatorias de Personal CAS',
    officialRuc: '20131366966',
    searchPattern: 'mininter OR "policia nacional"'
  },
  {
    name: 'MINISTERIO DE DEFENSA',
    shortName: 'MINDEF',
    convocatoriasUrl: 'https://www.gob.pe/institucion/mindef/colecciones/280-convocatorias-de-trabajo',
    portalName: 'MINDEF - Convocatorias de Trabajo',
    officialRuc: '20131367938',
    searchPattern: 'mindef OR "marina de guerra" OR "fuerza aerea"'
  },
  {
    name: 'MINISTERIO DE JUSTICIA Y DERECHOS HUMANOS',
    shortName: 'MINJUSDH',
    convocatoriasUrl: 'https://www.gob.pe/institucion/minjus/colecciones/201-convocatorias-de-trabajo',
    portalName: 'MINJUSDH - Convocatorias de Trabajo CAS',
    officialRuc: '20131371617',
    searchPattern: 'minjus OR minjusdh'
  },
  {
    name: 'MINISTERIO DE TRANSPORTES Y COMUNICACIONES',
    shortName: 'MTC',
    convocatoriasUrl: 'https://www.gob.pe/institucion/mtc/colecciones/199-convocatorias-de-trabajo',
    portalName: 'MTC - Convocatorias de Trabajo CAS',
    officialRuc: '20131372931',
    searchPattern: 'mtc'
  },
  {
    name: 'MINISTERIO DE DESARROLLO AGRARIO Y RIEGO',
    shortName: 'MIDAGRI',
    convocatoriasUrl: 'https://www.gob.pe/institucion/midagri/colecciones/294-convocatorias-de-trabajo',
    portalName: 'MIDAGRI - Convocatorias de Trabajo',
    officialRuc: '20131372931',
    searchPattern: 'midagri OR minagri'
  },
  {
    name: 'MINISTERIO DE TRABAJO Y PROMOCIÓN DEL EMPLEO',
    shortName: 'MTPE',
    convocatoriasUrl: 'https://www.gob.pe/institucion/mtpe/colecciones/188-convocatorias-de-trabajo',
    portalName: 'MTPE - Convocatorias de Trabajo CAS',
    officialRuc: '20131370815',
    searchPattern: 'mtpe'
  },
  {
    name: 'MINISTERIO DE DESARROLLO E INCLUSIÓN SOCIAL',
    shortName: 'MIDIS',
    convocatoriasUrl: 'https://www.gob.pe/institucion/midis/colecciones/186-convocatorias-de-trabajo',
    portalName: 'MIDIS - Convocatorias de Trabajo',
    officialRuc: '20546592237',
    searchPattern: 'midis'
  },
  {
    name: 'MINISTERIO DE ENERGÍA Y MINAS',
    shortName: 'MINEM',
    convocatoriasUrl: 'https://www.gob.pe/institucion/minem/colecciones/282-convocatorias-de-trabajo',
    portalName: 'MINEM - Convocatorias de Trabajo',
    officialRuc: '20131368829',
    searchPattern: 'minem'
  },
  {
    name: 'MINISTERIO DE LA PRODUCCIÓN',
    shortName: 'PRODUCE',
    convocatoriasUrl: 'https://www.gob.pe/institucion/produce/colecciones/233-convocatorias-de-trabajo',
    portalName: 'PRODUCE - Convocatorias de Trabajo',
    officialRuc: '20504794644',
    searchPattern: 'produce'
  },
  {
    name: 'MINISTERIO DE COMERCIO EXTERIOR Y TURISMO',
    shortName: 'MINCETUR',
    convocatoriasUrl: 'https://www.gob.pe/institucion/mincetur/colecciones/191-convocatorias-de-trabajo',
    portalName: 'MINCETUR - Convocatorias de Trabajo',
    officialRuc: '20504774295',
    searchPattern: 'mincetur'
  },
  {
    name: 'MINISTERIO DEL AMBIENTE',
    shortName: 'MINAM',
    convocatoriasUrl: 'https://www.gob.pe/institucion/minam/colecciones/292-convocatorias-de-trabajo',
    portalName: 'MINAM - Convocatorias de Trabajo',
    officialRuc: '20492982171',
    searchPattern: 'minam'
  },
  {
    name: 'MINISTERIO DE CULTURA',
    shortName: 'CULTURA',
    convocatoriasUrl: 'https://www.gob.pe/institucion/cultura/colecciones/202-convocatorias-de-trabajo',
    portalName: 'Ministerio de Cultura - Convocatorias de Trabajo',
    officialRuc: '20537630222',
    searchPattern: '"ministerio de cultura"'
  },
  {
    name: 'MINISTERIO DE VIVIENDA, CONSTRUCCIÓN Y SANEAMIENTO',
    shortName: 'VIVIENDA',
    convocatoriasUrl: 'https://www.gob.pe/institucion/vivienda/colecciones/279-convocatorias-de-trabajo',
    portalName: 'VIVIENDA - Convocatorias de Trabajo',
    officialRuc: '20504775348',
    searchPattern: 'vivienda'
  },
  {
    name: 'MINISTERIO DE LA MUJER Y POBLACIONES VULNERABLES',
    shortName: 'MIMP',
    convocatoriasUrl: 'https://www.gob.pe/institucion/mimp/colecciones/189-convocatorias-de-trabajo',
    portalName: 'MIMP - Convocatorias de Trabajo',
    officialRuc: '20131370211',
    searchPattern: 'mimp'
  },

  // Organismos Especializados, Reguladores y Sociales
  {
    name: 'CONSEJO NACIONAL PARA LA INTEGRACIÓN DE LA PERSONA CON DISCAPACIDAD',
    shortName: 'CONADIS',
    convocatoriasUrl: 'https://www.gob.pe/institucion/conadis/colecciones/453-convocatorias-de-trabajo-cas',
    portalName: 'CONADIS - Convocatorias de Trabajo CAS',
    officialRuc: '20452391039',
    searchPattern: 'conadis'
  },
  {
    name: 'INSTITUTO NACIONAL DE ESTADÍSTICA E INFORMÁTICA',
    shortName: 'INEI',
    convocatoriasUrl: 'https://uneteservicios.inei.gob.pe/',
    portalName: 'INEI - Convocatorias del Sistema Únete',
    officialRuc: '20131369981',
    searchPattern: 'inei'
  },
  {
    name: 'SUPERINTENDENCIA NACIONAL DE FISCALIZACIÓN LABORAL',
    shortName: 'SUNAFIL',
    convocatoriasUrl: 'https://www.gob.pe/institucion/sunafil/colecciones/203-convocatorias-de-trabajo',
    portalName: 'SUNAFIL - Convocatorias de Trabajo',
    officialRuc: '20555195444',
    searchPattern: 'sunafil'
  },
  {
    name: 'INDECOPI',
    shortName: 'INDECOPI',
    convocatoriasUrl: 'https://www.gob.pe/institucion/indecopi/colecciones/184-convocatorias-de-trabajo',
    portalName: 'INDECOPI - Convocatorias de Trabajo',
    officialRuc: '20133840533',
    searchPattern: 'indecopi'
  },
  {
    name: 'OSINERGMIN',
    shortName: 'OSINERGMIN',
    convocatoriasUrl: 'https://www.osinergmin.gob.pe/seccion/institucional/oportunidades-laborales',
    portalName: 'OSINERGMIN - Oportunidades Laborales',
    officialRuc: '20376082114',
    searchPattern: 'osinergmin'
  },
  {
    name: 'OSIPTEL',
    shortName: 'OSIPTEL',
    convocatoriasUrl: 'https://www.gob.pe/institucion/osiptel/colecciones/3610-convocatorias-de-trabajo',
    portalName: 'OSIPTEL - Convocatorias de Trabajo',
    officialRuc: '20216072127',
    searchPattern: 'osiptel'
  },
  {
    name: 'SUNASS',
    shortName: 'SUNASS',
    convocatoriasUrl: 'https://www.sunass.gob.pe/trabaja-con-nosotros/',
    portalName: 'SUNASS - Trabaja con Nosotros',
    officialRuc: '20165999488',
    searchPattern: 'sunass'
  },
  {
    name: 'SUTRAN',
    shortName: 'SUTRAN',
    convocatoriasUrl: 'https://www.gob.pe/institucion/sutran/colecciones/204-convocatorias-de-trabajo',
    portalName: 'SUTRAN - Convocatorias de Trabajo',
    officialRuc: '20536902385',
    searchPattern: 'sutran'
  },
  {
    name: 'AUTORIDAD DE TRANSPORTE URBANO PARA LIMA Y CALLAO',
    shortName: 'ATU',
    convocatoriasUrl: 'https://portal.atu.gob.pe/convocatorias/',
    portalName: 'ATU - Portal de Convocatorias',
    officialRuc: '20605151528',
    searchPattern: 'atu'
  },
  {
    name: 'SUPERINTENDENCIA NACIONAL DE LOS REGISTROS PÚBLICOS',
    shortName: 'SUNARP',
    convocatoriasUrl: 'https://www.gob.pe/institucion/sunarp/colecciones/195-convocatorias-de-trabajo',
    portalName: 'SUNARP - Convocatorias de Trabajo',
    officialRuc: '20267073010',
    searchPattern: 'sunarp'
  },
  {
    name: 'INSTITUTO NACIONAL PENITENCIARIO',
    shortName: 'INPE',
    convocatoriasUrl: 'https://www.inpe.gob.pe/convocatorias.html',
    portalName: 'INPE - Convocatorias de Personal',
    officialRuc: '20131370483',
    searchPattern: 'inpe'
  },
  {
    name: 'MIGRACIONES PERÚ',
    shortName: 'MIGRACIONES',
    convocatoriasUrl: 'https://www.gob.pe/institucion/migraciones/colecciones/228-convocatorias-de-trabajo',
    portalName: 'MIGRACIONES - Convocatorias de Trabajo',
    officialRuc: '20551246206',
    searchPattern: 'migraciones'
  },
  {
    name: 'PROINVERSIÓN',
    shortName: 'PROINVERSIÓN',
    convocatoriasUrl: 'https://www.investinperu.pe/es/proinversion/convocatorias-de-trabajo',
    portalName: 'PROINVERSIÓN - Convocatorias de Trabajo',
    officialRuc: '20380799643',
    searchPattern: 'proinversion'
  },
  {
    name: 'PROGRAMA NACIONAL CUNA MÁS',
    shortName: 'CUNA MÁS',
    convocatoriasUrl: 'https://www.gob.pe/institucion/cunamas/colecciones/287-convocatorias-de-trabajo',
    portalName: 'Cuna Más - Convocatorias de Trabajo',
    officialRuc: '20546592237',
    searchPattern: '"cuna mas"'
  },
  {
    name: 'PROGRAMA NACIONAL JUNTOS',
    shortName: 'JUNTOS',
    convocatoriasUrl: 'https://www.gob.pe/institucion/juntos/colecciones/291-convocatorias-de-trabajo',
    portalName: 'Juntos - Convocatorias de Trabajo',
    officialRuc: '20546592237',
    searchPattern: '"programa juntos"'
  },
  {
    name: 'PROGRAMA NACIONAL QALI WARMA',
    shortName: 'QALI WARMA',
    convocatoriasUrl: 'https://www.gob.pe/institucion/qaliwarma/colecciones/289-convocatorias-de-trabajo',
    portalName: 'Qali Warma - Convocatorias de Trabajo',
    officialRuc: '20546592237',
    searchPattern: '"qali warma"'
  },
  {
    name: 'PROGRAMA NACIONAL PAIS',
    shortName: 'PAIS',
    convocatoriasUrl: 'https://www.gob.pe/institucion/pais/colecciones/290-convocatorias-de-trabajo',
    portalName: 'Programa PAIS - Convocatorias de Trabajo',
    officialRuc: '20546592237',
    searchPattern: '"programa pais"'
  },
  {
    name: 'PRONABEC',
    shortName: 'PRONABEC',
    convocatoriasUrl: 'https://www.gob.pe/institucion/pronabec/colecciones/285-convocatorias-de-trabajo',
    portalName: 'PRONABEC - Convocatorias de Trabajo',
    officialRuc: '20546798153',
    searchPattern: 'pronabec'
  },
  {
    name: 'DEVIDA',
    shortName: 'DEVIDA',
    convocatoriasUrl: 'https://www.gob.pe/institucion/devida/colecciones/293-convocatorias-de-trabajo',
    portalName: 'DEVIDA - Convocatorias de Trabajo',
    officialRuc: '20168999926',
    searchPattern: 'devida'
  },
  {
    name: 'SERFOR',
    shortName: 'SERFOR',
    convocatoriasUrl: 'https://www.gob.pe/institucion/serfor/colecciones/3612-convocatorias-de-trabajo',
    portalName: 'SERFOR - Convocatorias de Trabajo',
    officialRuc: '20562836928',
    searchPattern: 'serfor'
  },
  {
    name: 'SENASA',
    shortName: 'SENASA',
    convocatoriasUrl: 'https://www.gob.pe/institucion/senasa/colecciones/3613-convocatorias-de-trabajo',
    portalName: 'SENASA - Convocatorias de Trabajo',
    officialRuc: '20207000148',
    searchPattern: 'senasa'
  },
  {
    name: 'OEFA',
    shortName: 'OEFA',
    convocatoriasUrl: 'https://www.gob.pe/institucion/oefa/colecciones/286-convocatorias-de-trabajo',
    portalName: 'OEFA - Convocatorias de Trabajo',
    officialRuc: '20521286769',
    searchPattern: 'oefa'
  },
  {
    name: 'SERNANP',
    shortName: 'SERNANP',
    convocatoriasUrl: 'https://www.gob.pe/institucion/sernanp/colecciones/3614-convocatorias-de-trabajo',
    portalName: 'SERNANP - Convocatorias de Trabajo',
    officialRuc: '20478053164',
    searchPattern: 'sernanp'
  },
  {
    name: 'SENAMHI',
    shortName: 'SENAMHI',
    convocatoriasUrl: 'https://www.gob.pe/institucion/senamhi/colecciones/3615-convocatorias-de-trabajo',
    portalName: 'SENAMHI - Convocatorias de Trabajo',
    officialRuc: '20131372779',
    searchPattern: 'senamhi'
  },

  // Universidades Públicas Principales
  {
    name: 'UNIVERSIDAD NACIONAL MAYOR DE SAN MARCOS',
    shortName: 'UNMSM',
    convocatoriasUrl: 'https://unmsm.edu.pe/trabaja-con-nosotros',
    portalName: 'UNMSM - Portal de Convocatorias',
    officialRuc: '20148092282',
    searchPattern: 'unmsm'
  },
  {
    name: 'UNIVERSIDAD NACIONAL DE INGENIERÍA',
    shortName: 'UNI',
    convocatoriasUrl: 'https://www.uni.edu.pe/convocatorias',
    portalName: 'UNI - Convocatorias CAS y Docentes',
    officialRuc: '20169004359',
    searchPattern: 'uni OR "universidad nacional de ingenieria"'
  },
  {
    name: 'UNIVERSIDAD NACIONAL AGRARIA LA MOLINA',
    shortName: 'UNALM',
    convocatoriasUrl: 'https://www.lamolina.edu.pe/convocatorias/',
    portalName: 'UNALM - Portal de Convocatorias de Personal',
    officialRuc: '20148092363',
    searchPattern: 'unalm OR "agraria la molina"'
  },
  {
    name: 'UNIVERSIDAD NACIONAL JOSÉ MARÍA ARGUEDAS',
    shortName: 'UNAJMA',
    convocatoriasUrl: 'https://www.unajma.edu.pe/convocatorias',
    portalName: 'UNAJMA - Convocatorias CAS y 276',
    officialRuc: '20452391039',
    searchPattern: 'unajma'
  },
  {
    name: 'UNIVERSIDAD NACIONAL DE SAN AGUSTÍN DE AREQUIPA',
    shortName: 'UNSA',
    convocatoriasUrl: 'https://www.unsa.edu.pe/convocatorias/',
    portalName: 'UNSA - Convocatorias de Personal',
    officialRuc: '20148092444',
    searchPattern: 'unsa OR "san agustin de arequipa"'
  },
  {
    name: 'UNIVERSIDAD NACIONAL DE SAN ANTONIO ABAD DEL CUSCO',
    shortName: 'UNSAAC',
    convocatoriasUrl: 'https://www.unsaac.edu.pe/convocatorias/',
    portalName: 'UNSAAC - Convocatorias Laborales',
    officialRuc: '20148092525',
    searchPattern: 'unsaac'
  },
  {
    name: 'UNIVERSIDAD NACIONAL DE TRUJILLO',
    shortName: 'UNT',
    convocatoriasUrl: 'https://unitru.edu.pe/convocatorias',
    portalName: 'UNT - Convocatorias de Personal',
    officialRuc: '20148092606',
    searchPattern: 'unitru OR "universidad nacional de trujillo"'
  },
  {
    name: 'UNIVERSIDAD NACIONAL DE LA AMAZONÍA PERUANA',
    shortName: 'UNAP',
    convocatoriasUrl: 'https://www.unapiquitos.edu.pe/convocatorias.php',
    portalName: 'UNAP - Convocatorias de Personal',
    officialRuc: '20148092797',
    searchPattern: 'unap OR "amazonia peruana"'
  },
  {
    name: 'UNIVERSIDAD NACIONAL DEL ALTIPLANO DE PUNO',
    shortName: 'UNA PUNO',
    convocatoriasUrl: 'https://www.unap.edu.pe/web/convocatorias',
    portalName: 'UNA Puno - Convocatorias de Personal',
    officialRuc: '20148092878',
    searchPattern: '"una puno" OR "altiplano de puno"'
  },
  {
    name: 'UNIVERSIDAD NACIONAL DE PIURA',
    shortName: 'UNP',
    convocatoriasUrl: 'https://www.unp.edu.pe/convocatorias/',
    portalName: 'UNP - Convocatorias de Personal',
    officialRuc: '20148092959',
    searchPattern: 'unp OR "universidad nacional de piura"'
  },
  {
    name: 'UNIVERSIDAD NACIONAL DE SAN CRISTÓBAL DE HUAMANGA',
    shortName: 'UNSCH',
    convocatoriasUrl: 'https://unsch.edu.pe/convocatorias/',
    portalName: 'UNSCH - Convocatorias de Personal',
    officialRuc: '20148093092',
    searchPattern: 'unsch OR "san cristobal de huamanga"'
  },
  {
    name: 'UNIVERSIDAD NACIONAL AGRARIA DE LA SELVA',
    shortName: 'UNAS',
    convocatoriasUrl: 'https://www.unas.edu.pe/convocatorias/',
    portalName: 'UNAS - Portal de Convocatorias Oficiales',
    officialRuc: '20148093173',
    searchPattern: 'unas OR "agraria de la selva"'
  }
];

/**
 * Resuelve la URL canónica institucional de convocatorias para cualquier entidad dada.
 * Si la entidad no coincide de forma exacta, usa el buscador oficial de SERVIR Talento Perú
 * con los parámetros de la entidad para que el usuario caiga en sus resultados directos,
 * eliminando la redirección ciega a la portada general de www.gob.pe/servir.
 */
export function resolveEntityCanonicalPortal(entityName?: string): {
  url: string;
  portalName: string;
  isSpecific: boolean;
  shortName?: string;
  searchPattern?: string;
} {
  if (!entityName || typeof entityName !== 'string') {
    return {
      url: 'https://app.servir.gob.pe/DifusionOfertasExterno/faces/consultas/ofertas_laborales.xhtml',
      portalName: 'SERVIR - Sistema Oficial Talento Perú',
      isSpecific: false
    };
  }

  const norm = entityName.toUpperCase().trim();

  // 1. Buscar coincidencia en el directorio canónico
  for (const entity of CANONICAL_ENTITIES) {
    if (
      norm.includes(entity.shortName.toUpperCase()) ||
      norm.includes(entity.name.toUpperCase()) ||
      (entity.searchPattern && new RegExp(entity.searchPattern.replace(/"/g, ''), 'i').test(norm))
    ) {
      return {
        url: entity.convocatoriasUrl,
        portalName: entity.portalName,
        isSpecific: true,
        shortName: entity.shortName,
        searchPattern: entity.searchPattern
      };
    }
  }

  // 2. Coincidencias por patrones de tipo de institución en gob.pe
  if (norm.includes('GOBIERNO REGIONAL') || norm.includes('GORE')) {
    const goreMatch = norm.match(/(?:GOBIERNO REGIONAL|GORE)\s+(?:DE\s+)?([A-ZÁÉÍÓÚÑ]+)/i);
    const regionName = goreMatch ? goreMatch[1].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '';
    if (regionName) {
      return {
        url: `https://www.gob.pe/region${regionName}`,
        portalName: `GORE ${regionName.toUpperCase()} - Portal Institucional Oficial`,
        isSpecific: true,
        shortName: `GORE ${regionName.toUpperCase()}`
      };
    }
  }

  if (norm.includes('MUNICIPALIDAD PROVINCIAL') || norm.includes('MUNICIPALIDAD DISTRITAL')) {
    const muniMatch = norm.match(/MUNICIPALIDAD\s+(?:PROVINCIAL|DISTRITAL)\s+(?:DE\s+)?([A-ZÁÉÍÓÚÑ]+)/i);
    const muniName = muniMatch ? muniMatch[1].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '';
    if (muniName) {
      return {
        url: `https://www.gob.pe/muni${muniName}`,
        portalName: `Municipalidad de ${muniName.toUpperCase()} - Portal Oficial`,
        isSpecific: true,
        shortName: `Muni ${muniName.toUpperCase()}`
      };
    }
  }

  // 3. Fallback inteligente: enlace directo a la consulta filtrada en SERVIR Talento Perú Oficial
  // (Nunca la portada estática www.gob.pe/servir)
  const encodedEntity = encodeURIComponent(entityName.slice(0, 40));
  return {
    url: `https://app.servir.gob.pe/DifusionOfertasExterno/faces/consultas/ofertas_laborales.xhtml?entidad=${encodedEntity}`,
    portalName: `${entityName} - Convocatorias en SERVIR Talento Perú`,
    isSpecific: false
  };
}
