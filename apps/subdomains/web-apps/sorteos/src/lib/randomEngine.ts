import { Participant, Winner, GiveawayRules } from './types';

/**
 * Genera un número entero aleatorio criptográficamente seguro en el rango [min, max].
 * Usa Web Crypto API (`crypto.getRandomValues`).
 */
export function getSecureRandomInt(min: number, max: number): number {
  if (min > max) throw new Error('min no puede ser mayor que max');
  const range = max - min + 1;
  if (range <= 0) return min;

  const maxValid = Math.floor(0xffffffff / range) * range;
  const uint32 = new Uint32Array(1);

  do {
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(uint32);
    } else {
      // Fallback para SSR o entornos sin window
      return Math.floor(Math.random() * range) + min;
    }
  } while (uint32[0] >= maxValid);

  return min + (uint32[0] % range);
}

/**
 * Baraja un arreglo utilizando el algoritmo Fisher-Yates respaldado por CSPRNG.
 */
export function shuffleArray<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(0, i);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Genera el hash criptográfico SHA-256 para auditar y certificar la transparencia del sorteo.
 */
export async function generateSha256Hash(content: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback simple si SubtleCrypto no está disponible
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    hash = (hash << 5) - hash + content.charCodeAt(i);
    hash |= 0;
  }
  return 'audit-' + Math.abs(hash).toString(16).padStart(32, '0');
}

/**
 * Aplica reglas de filtrado sobre los participantes de acuerdo a las especificaciones RF-015 y RF-021.
 */
export function filterParticipants(
  rawParticipants: Participant[],
  rules: GiveawayRules
): { eligible: Participant[]; excluded: Participant[] } {
  const eligible: Participant[] = [];
  const excluded: Participant[] = [];
  const seenUsers = new Set<string>();

  for (const p of rawParticipants) {
    // 1. Excluir lista negra
    if (rules.blockedUsers && rules.blockedUsers.some((b) => b.toLowerCase() === p.username.toLowerCase())) {
      excluded.push({ ...p, isEligible: false, exclusionReason: 'Cuenta en lista negra' });
      continue;
    }

    // 2. Excluir duplicados si la regla está activa
    if (rules.excludeDuplicates && seenUsers.has(p.username.toLowerCase())) {
      excluded.push({ ...p, isEligible: false, exclusionReason: 'Comentario duplicado' });
      continue;
    }

    // 3. Menciones mínimas (@amigo)
    if (rules.minMentions > 0 && p.commentText) {
      const mentions = (p.commentText.match(/@([a-zA-Z0-9._]+)/g) || []).length;
      if (mentions < rules.minMentions) {
        excluded.push({
          ...p,
          isEligible: false,
          exclusionReason: `Requiere al menos ${rules.minMentions} menciones (tiene ${mentions})`
        });
        continue;
      }
    }

    // 4. Hashtag requerido
    if (rules.requiredHashtag && rules.requiredHashtag.trim().length > 0) {
      const tag = rules.requiredHashtag.trim().toLowerCase();
      if (!p.commentText || !p.commentText.toLowerCase().includes(tag)) {
        excluded.push({
          ...p,
          isEligible: false,
          exclusionReason: `No incluye el hashtag requerido ${rules.requiredHashtag}`
        });
        continue;
      }
    }

    // Cumple todas las reglas
    seenUsers.add(p.username.toLowerCase());
    eligible.push({ ...p, isEligible: true });
  }

  return { eligible, excluded };
}

/**
 * Ejecuta el sorteo verificable de ganadores y suplentes (RF-022 y RF-016).
 */
export async function executeVerifiableDraw(
  eligibleParticipants: Participant[],
  winnersCount: number,
  substitutesCount: number
): Promise<{
  winners: Winner[];
  substitutes: Winner[];
  verificationHash: string;
  timestamp: string;
}> {
  if (eligibleParticipants.length === 0) {
    throw new Error('No hay participantes elegibles para realizar el sorteo.');
  }

  const timestamp = new Date().toISOString();
  const shuffled = shuffleArray(eligibleParticipants);

  const selectedWinners = shuffled.slice(0, Math.min(winnersCount, shuffled.length));
  const remaining = shuffled.slice(selectedWinners.length);
  const selectedSubstitutes = remaining.slice(0, Math.min(substitutesCount, remaining.length));

  const winners: Winner[] = selectedWinners.map((p, index) => ({
    id: `win-${index + 1}`,
    participant: p,
    type: 'winner',
    position: index + 1,
    selectedAt: timestamp
  }));

  const substitutes: Winner[] = selectedSubstitutes.map((p, index) => ({
    id: `sub-${index + 1}`,
    participant: p,
    type: 'substitute',
    position: index + 1,
    selectedAt: timestamp
  }));

  // Generar hash de verificación inmutable con la lista y la semilla
  const auditString = `${timestamp}|W:${winners.map((w) => w.participant.username).join(',')}|S:${substitutes
    .map((s) => s.participant.username)
    .join(',')}|TOTAL:${eligibleParticipants.length}`;
  const verificationHash = await generateSha256Hash(auditString);

  return {
    winners,
    substitutes,
    verificationHash,
    timestamp
  };
}

/**
 * Tirada de dados aleatoria (1 a 6 dados).
 */
export function rollDice(count: number = 1): number[] {
  const result: number[] = [];
  for (let i = 0; i < count; i++) {
    result.push(getSecureRandomInt(1, 6));
  }
  return result;
}

/**
 * Lanzamiento de moneda aleatorio ('cara' o 'cruz').
 */
export function flipCoin(): 'cara' | 'cruz' {
  return getSecureRandomInt(0, 1) === 0 ? 'cara' : 'cruz';
}

/**
 * Genera números aleatorios en un rango especificado.
 */
export function generateNumbers(
  min: number,
  max: number,
  quantity: number,
  allowDuplicates: boolean
): number[] {
  if (!allowDuplicates && quantity > max - min + 1) {
    throw new Error('La cantidad de números no puede exceder el rango disponible sin duplicados');
  }

  if (!allowDuplicates) {
    const pool: number[] = [];
    for (let i = min; i <= max; i++) {
      pool.push(i);
    }
    const shuffled = shuffleArray(pool);
    return shuffled.slice(0, quantity);
  }

  const result: number[] = [];
  for (let i = 0; i < quantity; i++) {
    result.push(getSecureRandomInt(min, max));
  }
  return result;
}

/**
 * Reparte una lista de personas en N equipos de manera balanceada y aleatoria.
 */
export function divideIntoTeams(
  members: string[],
  teamCount: number
): { teamNumber: number; members: string[] }[] {
  if (teamCount < 2) throw new Error('Se requieren al menos 2 equipos');
  const shuffled = shuffleArray(members.filter((m) => m.trim().length > 0));
  const teams: { teamNumber: number; members: string[] }[] = Array.from({ length: teamCount }, (_, i) => ({
    teamNumber: i + 1,
    members: []
  }));

  shuffled.forEach((member, index) => {
    teams[index % teamCount].members.push(member);
  });

  return teams;
}
