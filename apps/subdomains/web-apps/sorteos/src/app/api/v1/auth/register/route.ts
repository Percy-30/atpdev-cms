import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, plan = 'free' } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son obligatorios.' },
        { status: 400 }
      );
    }

    const newUser = {
      id: `usr_${Date.now().toString(36)}`,
      name: name || 'Usuario Creador',
      email,
      plan,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Usuario registrado exitosamente (RF-001).',
      user: newUser,
      token: `jwt_session_${Date.now().toString(36)}`
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error en el registro.' }, { status: 500 });
  }
}
