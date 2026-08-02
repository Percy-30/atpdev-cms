import { createLead } from "@atpdev/database";

export default function SobreMiPage() {
  async function submitLead(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    await createLead({
      name,
      email,
      company: subject, // Usamos el asunto como empresa/contexto
      message,
    });
  }

  return (
    <main className="main">
      {/* About Section */}
      <section id="about" className="about section">
        {/* Section Title */}
        <div className="container section-title" data-aos="fade-up">
          <h2>Sobre Mí</h2>
          <p>Desarrollador Full Stack y Mobile con experiencia en la creación de aplicaciones nativas en Android y plataformas web modernas. Apasionado por la optimización de rendimiento, arquitecturas limpias y la integración de soluciones de Inteligencia Artificial.</p>
        </div>

        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row gy-4 justify-content-center">
            <div className="col-lg-4">
              <img src="/assets/img/my-profile-img.jpg" className="img-fluid" alt="Profile" />
            </div>
            <div className="col-lg-8 content">
              <h2>Software Developer &amp; Mobile Specialist.</h2>
              <p className="fst-italic py-3">
                Creación y monetización de aplicaciones de alto impacto. Integración continua con APIs y arquitecturas escalables para mejorar flujos de negocio.
              </p>
              <div className="row">
                <div className="col-lg-6">
                  <ul>
                    <li><i className="bi bi-chevron-right"></i> <strong>Nombre:</strong> <span>Percy Acha</span></li>
                    <li><i className="bi bi-chevron-right"></i> <strong>Cumpleaños:</strong> <span>14 Nov 1995</span></li>
                    <li><i className="bi bi-chevron-right"></i> <strong>Teléfono:</strong> <span>+51 987 654 321</span></li>
                    <li><i className="bi bi-chevron-right"></i> <strong>Ciudad:</strong> <span>Lima, Perú</span></li>
                  </ul>
                </div>
                <div className="col-lg-6">
                  <ul>
                    <li><i className="bi bi-chevron-right"></i> <strong>Edad:</strong> <span>28</span></li>
                    <li><i className="bi bi-chevron-right"></i> <strong>Grado:</strong> <span>Ingeniero de Software</span></li>
                    <li><i className="bi bi-chevron-right"></i> <strong>Email:</strong> <span>contacto@atpdev.dev</span></li>
                    <li><i className="bi bi-chevron-right"></i> <strong>Freelance:</strong> <span>Disponible</span></li>
                  </ul>
                </div>
              </div>
              <p className="py-3">
                A lo largo de mi carrera, he liderado el desarrollo de productos desde la concepción hasta el despliegue en producción. Tengo experiencia comprobada en la publicación de aplicaciones en la Google Play Store, integración con bibliotecas de facturación y arquitectura Clean. Recientemente he expandido mis capacidades hacia pipelines automatizados impulsados por Inteligencia Artificial.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="stats section">
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row gy-4">
            <div className="col-lg-3 col-md-6">
              <div className="stats-item">
                <i className="bi bi-emoji-smile"></i>
                <span data-purecounter-start="0" data-purecounter-end="15" data-purecounter-duration="1" className="purecounter"></span>
                <p><strong>Clientes Felices</strong> <span>en proyectos freelance</span></p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="stats-item">
                <i className="bi bi-journal-richtext"></i>
                <span data-purecounter-start="0" data-purecounter-end="42" data-purecounter-duration="1" className="purecounter"></span>
                <p><strong>Proyectos</strong> <span>Apps y Webs en producción</span></p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="stats-item">
                <i className="bi bi-headset"></i>
                <span data-purecounter-start="0" data-purecounter-end="2500" data-purecounter-duration="1" className="purecounter"></span>
                <p><strong>Horas de Código</strong> <span>creando arquitecturas limpias</span></p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="stats-item">
                <i className="bi bi-people"></i>
                <span data-purecounter-start="0" data-purecounter-end="100" data-purecounter-duration="1" className="purecounter"></span>
                <p><strong>Alumnos</strong> <span>formados en tecnología</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="skills section light-background">
        <div className="container section-title" data-aos="fade-up">
          <h2>Skills Técnicas</h2>
          <p>Nivel de dominio técnico en las principales herramientas, lenguajes y frameworks de la industria del software.</p>
        </div>
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row skills-content skills-animation">
            <div className="col-lg-6">
              <div className="progress">
                <span className="skill"><span>Kotlin / Android</span> <i className="val">100%</i></span>
                <div className="progress-bar-wrap">
                  <div className="progress-bar" role="progressbar" aria-valuenow={100} aria-valuemin={0} aria-valuemax={100} style={{ width: '100%' }}></div>
                </div>
              </div>
              <div className="progress">
                <span className="skill"><span>React / Next.js</span> <i className="val">90%</i></span>
                <div className="progress-bar-wrap">
                  <div className="progress-bar" role="progressbar" aria-valuenow={90} aria-valuemin={0} aria-valuemax={100} style={{ width: '90%' }}></div>
                </div>
              </div>
              <div className="progress">
                <span className="skill"><span>Node.js / Express</span> <i className="val">85%</i></span>
                <div className="progress-bar-wrap">
                  <div className="progress-bar" role="progressbar" aria-valuenow={85} aria-valuemin={0} aria-valuemax={100} style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="progress">
                <span className="skill"><span>Clean Architecture</span> <i className="val">95%</i></span>
                <div className="progress-bar-wrap">
                  <div className="progress-bar" role="progressbar" aria-valuenow={95} aria-valuemin={0} aria-valuemax={100} style={{ width: '95%' }}></div>
                </div>
              </div>
              <div className="progress">
                <span className="skill"><span>AI Integrations (Gemini)</span> <i className="val">80%</i></span>
                <div className="progress-bar-wrap">
                  <div className="progress-bar" role="progressbar" aria-valuenow={80} aria-valuemin={0} aria-valuemax={100} style={{ width: '80%' }}></div>
                </div>
              </div>
              <div className="progress">
                <span className="skill"><span>Database (Supabase/Room)</span> <i className="val">85%</i></span>
                <div className="progress-bar-wrap">
                  <div className="progress-bar" role="progressbar" aria-valuenow={85} aria-valuemin={0} aria-valuemax={100} style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resume Section */}
      <section id="resume" className="resume section">
        <div className="container section-title" data-aos="fade-up">
          <h2>Currículum Vitae</h2>
          <p>Experiencia comprobada en la publicación de aplicaciones nativas, integración de IA y enseñanza técnica.</p>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-6" data-aos="fade-up" data-aos-delay="100">
              <h3 className="resume-title">Perfil</h3>
              <div className="resume-item pb-0">
                <h4>Percy Acha (ATP DEV)</h4>
                <p><em>Ingeniero de Software y Desarrollador Móvil con más de 4 años de experiencia diseñando y liderando ecosistemas web y apps móviles orientadas a escalar.</em></p>
                <ul>
                  <li>Lima, Perú</li>
                  <li>+51 987 654 321</li>
                  <li>contacto@atpdev.dev</li>
                </ul>
              </div>
              <h3 className="resume-title">Educación</h3>
              <div className="resume-item">
                <h4>Ingeniería de Software</h4>
                <h5>2015 - 2019</h5>
                <p><em>Universidad Nacional Mayor, Lima</em></p>
                <p>Especialización en arquitectura de sistemas, diseño de bases de datos relacionales e ingeniería de requerimientos.</p>
              </div>
              <div className="resume-item">
                <h4>Certificación Google Android Developer</h4>
                <h5>2020</h5>
                <p><em>Google Developers</em></p>
                <p>Dominio avanzado de Kotlin, Jetpack Compose, Room Database, y arquitecturas MVVM.</p>
              </div>
            </div>
            <div className="col-lg-6" data-aos="fade-up" data-aos-delay="200">
              <h3 className="resume-title">Experiencia Profesional</h3>
              <div className="resume-item">
                <h4>Creador de Apps &amp; Indie Developer</h4>
                <h5>2023 - Presente</h5>
                <p><em>ATP DEV Studios, Lima, PE</em></p>
                <ul>
                  <li>Desarrollo arquitectónico completo de <strong>ChannelsTV</strong> y <strong>Lector QR Pro</strong> en Kotlin con Hilt, Room y Compose.</li>
                  <li>Implementación del sistema de pagos Google Play Billing Library para modelos de suscripción Premium.</li>
                  <li>Liderazgo en la creación de flujos automatizados de IA (Almaniq) que publican videos cortos desatendidos.</li>
                </ul>
              </div>
              <div className="resume-item">
                <h4>Docente de Tecnología - IESTP</h4>
                <h5>2021 - 2023</h5>
                <p><em>Instituto de Educación Superior Tecnológico, Lima</em></p>
                <ul>
                  <li>Instrucción presencial a más de 100 alumnos en Programación Orientada a Objetos y Desarrollo Móvil.</li>
                  <li>Actualización del currículo educativo integrando tecnologías modernas como Node.js y React.</li>
                  <li>Gestión de proyectos finales garantizando buenas prácticas de Clean Code.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="portfolio section light-background">
        <div className="container section-title" data-aos="fade-up">
          <h2>Portafolio</h2>
          <p>Explora mis proyectos más recientes, desde aplicaciones nativas en Android hasta plataformas Web impulsadas por Inteligencia Artificial.</p>
        </div>
        <div className="container">
          <div className="isotope-layout" data-default-filter="*" data-layout="masonry" data-sort="original-order">
            <ul className="portfolio-filters isotope-filters" data-aos="fade-up" data-aos-delay="100">
              <li data-filter="*" className="filter-active">Todos</li>
              <li data-filter=".filter-app">Android Apps</li>
              <li data-filter=".filter-product">IA & Bots</li>
              <li data-filter=".filter-branding">Webs</li>
            </ul>
            <div className="row gy-4 isotope-container" data-aos="fade-up" data-aos-delay="200">
              <div className="col-lg-4 col-md-6 portfolio-item isotope-item filter-app">
                <div className="portfolio-content h-100">
                  <img src="/assets/img/portfolio/app-1.jpg" className="img-fluid" alt="" />
                  <div className="portfolio-info">
                    <h4>ChannelsTV</h4>
                    <p>App de Streaming en Android (Kotlin)</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 portfolio-item isotope-item filter-product">
                <div className="portfolio-content h-100">
                  <img src="/assets/img/portfolio/product-1.jpg" className="img-fluid" alt="" />
                  <div className="portfolio-info">
                    <h4>Almaniq Content Pipeline</h4>
                    <p>Automatización de videos cortos con IA</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 portfolio-item isotope-item filter-app">
                <div className="portfolio-content h-100">
                  <img src="/assets/img/portfolio/branding-1.jpg" className="img-fluid" alt="" />
                  <div className="portfolio-info">
                    <h4>Lector QR Pro</h4>
                    <p>Lector y generador de QRs con suscripción</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services section">
        <div className="container section-title" data-aos="fade-up">
          <h2>Servicios</h2>
          <p>Soluciones tecnológicas integrales para transformar tu negocio.</p>
        </div>
        <div className="container">
          <div className="row gy-4">
            <div className="col-lg-4 col-md-6 service-item d-flex" data-aos="fade-up" data-aos-delay="100">
              <div className="icon flex-shrink-0"><i className="bi bi-phone"></i></div>
              <div>
                <h4 className="title">Desarrollo Móvil Nativo</h4>
                <p className="description">Construcción de aplicaciones Android de alto rendimiento usando Kotlin, Jetpack Compose y Clean Architecture.</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 service-item d-flex" data-aos="fade-up" data-aos-delay="200">
              <div className="icon flex-shrink-0"><i className="bi bi-laptop"></i></div>
              <div>
                <h4 className="title">Desarrollo Web Full Stack</h4>
                <p className="description">Creación de plataformas rápidas y SEO-friendly utilizando Next.js, React y bases de datos como Supabase.</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 service-item d-flex" data-aos="fade-up" data-aos-delay="300">
              <div className="icon flex-shrink-0"><i className="bi bi-robot"></i></div>
              <div>
                <h4 className="title">Automatización con IA</h4>
                <p className="description">Integración de LLMs (Gemini, ChatGPT) para automatizar creación de contenido, bots de Telegram y pipelines.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact section">
        <div className="container section-title" data-aos="fade-up">
          <h2>Contacto</h2>
          <p>¿Tienes un proyecto en mente o buscas un desarrollador especializado? Escríbeme.</p>
        </div>
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row gy-4">
            <div className="col-lg-5">
              <div className="info-wrap">
                <div className="info-item d-flex" data-aos="fade-up" data-aos-delay="200">
                  <i className="bi bi-geo-alt flex-shrink-0"></i>
                  <div>
                    <h3>Ubicación</h3>
                    <p>Lima, Perú</p>
                  </div>
                </div>
                <div className="info-item d-flex" data-aos="fade-up" data-aos-delay="300">
                  <i className="bi bi-telephone flex-shrink-0"></i>
                  <div>
                    <h3>Llámame</h3>
                    <p>+51 987 654 321</p>
                  </div>
                </div>
                <div className="info-item d-flex" data-aos="fade-up" data-aos-delay="400">
                  <i className="bi bi-envelope flex-shrink-0"></i>
                  <div>
                    <h3>Correo</h3>
                    <p>contacto@atpdev.dev</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <form action={submitLead} className="php-email-form" data-aos="fade-up" data-aos-delay="200">
                <div className="row gy-4">
                  <div className="col-md-6">
                    <label htmlFor="name-field" className="pb-2">Tu Nombre</label>
                    <input type="text" name="name" id="name-field" className="form-control" required />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="email-field" className="pb-2">Tu Correo</label>
                    <input type="email" className="form-control" name="email" id="email-field" required />
                  </div>
                  <div className="col-md-12">
                    <label htmlFor="subject-field" className="pb-2">Asunto / Empresa</label>
                    <input type="text" className="form-control" name="subject" id="subject-field" required />
                  </div>
                  <div className="col-md-12">
                    <label htmlFor="message-field" className="pb-2">Mensaje</label>
                    <textarea className="form-control" name="message" rows={10} id="message-field" required></textarea>
                  </div>
                  <div className="col-md-12 text-center">
                    <button type="submit" className="btn btn-primary" style={{ background: '#149ddd', border: 0, padding: '10px 24px', color: '#fff', transition: '0.4s', borderRadius: '50px' }}>Enviar Mensaje</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
