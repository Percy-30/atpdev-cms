import React from 'react';
import Link from 'next/link';
import { Lock, ArrowLeft, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Política de Privacidad | Sorteos Pro - Plataforma SaaS de Sorteos',
  description: 'Política de Privacidad y tratamiento de datos personales de Sorteos Pro conforme al RGPD y normativas de protección de datos.'
};

export default function PrivacidadPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Volver al inicio</span>
      </Link>

      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-mono font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Protección de Datos & RGPD</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-display text-white">
          Política de Privacidad
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Última actualización: 22 de septiembre de 2026. Compromiso de transparencia y mínimo tratamiento de datos personales.
        </p>
      </div>

      <div className="glass-card rounded-3xl p-8 sm:p-12 border border-white/10 space-y-8 text-sm text-zinc-300 leading-relaxed font-sans">
        <section className="space-y-3">
          <h2 className="text-lg font-bold font-display text-white">1. Responsable del Tratamiento</h2>
          <p>
            El responsable del tratamiento de los datos recabados en este sitio web es ATP Dev Solutions, con domicilio en Perú y operaciones tecnológicas globales. Puedes comunicarte con nuestro Delegado de Protección de Datos a través del correo electrónico <span className="text-purple-400 font-mono">privacidad@atpdev.pe</span>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-display text-white">2. Datos Recopilados de Redes Sociales</h2>
          <p>
            Al utilizar nuestras herramientas de sorteos para Instagram, Facebook o YouTube:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-zinc-400">
            <li>Únicamente procesamos información pública: nombre de usuario (@handle), fecha del comentario y texto del comentario emitido por los participantes en la publicación seleccionada.</li>
            <li>No accedemos a listas de contactos, números telefónicos, direcciones de correo privado ni contraseñas.</li>
            <li>Los datos de los comentarios se procesan temporalmente para la determinación de ganadores y no se comercializan a terceros bajo ninguna circunstancia.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-display text-white">3. Publicidad y Verificación de Ganadores</h2>
          <p>
            Para dar cumplimiento a la transparencia exigida por las bases de sorteos y normativas de consumo, los nombres de usuario de los ganadores y suplentes, junto con el hash criptográfico SHA-256 de la tirada, se publican en una página de resultados de libre acceso (Landing de Sorteo y Certificado Digital).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-display text-white">4. Cookies y Almacenamiento Local</h2>
          <p>
            Sorteos Pro utiliza almacenamiento local seguro (`localStorage`) para persistir tus sorteos recientes y preferencias de visualización (modo oscuro, filtros seleccionados) sin requerir cookies intrusivas de rastreo de terceros.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-display text-white">5. Derechos del Usuario (ARCO)</h2>
          <p>
            Cualquier usuario puede ejercer sus derechos de Acceso, Rectificación, Cancelación y Oposición solicitando la eliminación de certificados o desvinculación de registros contactando directamente a <span className="text-purple-400 font-mono">soporte@atpdev.pe</span>.
          </p>
        </section>
      </div>
    </div>
  );
}
