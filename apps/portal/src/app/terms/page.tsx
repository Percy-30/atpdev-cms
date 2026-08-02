import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#050608] text-gray-300 py-24 px-6 font-sans">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-blue-500 hover:text-blue-400 mb-8 inline-block">
          &larr; Volver al inicio
        </Link>
        <h1 className="text-4xl font-black text-white mb-8">Términos de Servicio</h1>
        
        <div className="space-y-6 leading-relaxed text-gray-400">
          <p>
            <strong>Última actualización: Agosto 2026</strong>
          </p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Aceptación de los Términos</h2>
          <p>
            Al acceder y utilizar el sitio web atpdev.dev y sus subdominios asociados, aceptas estar sujeto a estos Términos de Servicio. Si no estás de acuerdo con alguna parte de los términos, no podrás acceder a nuestros servicios.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Propiedad Intelectual</h2>
          <p>
            Todo el contenido, diseños, logotipos, código fuente y aplicaciones mostradas en este sitio web (salvo que se indique que son Open Source o pertenezcan a terceros) son propiedad exclusiva de Percy Acha Taipe (ATP Dev). No se permite la reproducción total o parcial sin autorización expresa.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Servicios de Desarrollo y Consultoría</h2>
          <p>
            Las solicitudes de contacto para servicios de desarrollo de software, integraciones o consultoría están sujetas a evaluación. El envío de una solicitud a través del formulario de contacto no garantiza la prestación del servicio. Todos los acuerdos comerciales finales se formalizarán por separado.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Subdominios y Aplicaciones de Terceros</h2>
          <p>
            Este sitio enlaza a proyectos y herramientas alojadas en subdominios (ej. papascan.atpdev.dev). El uso de esas herramientas específicas puede estar sujeto a sus propios términos de uso, especialmente aquellas que ofrecen funcionalidades Premium o que muestran anuncios a través de Google AdSense.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Limitación de Responsabilidad</h2>
          <p>
            ATP Dev no será responsable de ningún daño directo, indirecto, incidental, especial o consecuente que resulte del uso o la incapacidad de usar nuestros servicios web o el software aquí promocionado.
          </p>
        </div>
      </div>
    </div>
  );
}
