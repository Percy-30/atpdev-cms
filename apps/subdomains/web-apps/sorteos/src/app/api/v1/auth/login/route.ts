import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Credenciales incompletas.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Inicio de sesión exitoso (RF-002).',
      user: {
        id: 'usr_default_demo',
        name: 'Creador Sorteos Pro',
        email,
        plan: 'pro',
        status: 'active'
      },
      token: `jwt_session_${Date.now().toString(36)}`
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error en autenticación.' }, { status: 500 });
  }
}
