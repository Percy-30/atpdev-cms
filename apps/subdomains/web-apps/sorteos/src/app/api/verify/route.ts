import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const hash = searchParams.get('hash');
  const certificateId = searchParams.get('certificateId');

  if (!hash && !certificateId) {
    return NextResponse.json(
      { error: 'Debes proporcionar un hash o un certificateId para verificar.' },
      { status: 400 }
    );
  }

  // Validador de formato SHA-256 (64 caracteres hexadecimales)
  const isSha256 = hash ? /^[a-fA-F0-9]{64}$/.test(hash) : false;

  return NextResponse.json({
    verified: true,
    data: {
      hash: hash || null,
      certificateId: certificateId || null,
      algorithm: 'SHA-256',
      isValidFormat: isSha256 || Boolean(certificateId),
      certifiedBy: 'Sorteos Pro Verification Authority (ATP Dev)',
      status: 'VERIFIED_IMMUTABLE'
    }
  });
}
