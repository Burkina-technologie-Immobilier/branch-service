
export class Utils {

    // 7 a 14 chiffre
    static phoneRegex = /^\+[1-9]\d{7,14}$/;

    // ^[A-Za-z0-9_-] → alphabet officiel nanoid
    // {21} → longueur par défaut nanoid
    // ^$ → chaîne complète, pas partielle
    static nanoidRegex = /^[A-Za-z0-9_-]{21}$/;
    static uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    // ^[^\s@]+@[^\s@] au moins 1 caractere + @ + au moins 1 caractere + . + extension
    static emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // (?=.*[A-Za-z]) → au moins une lettre
    // (?=.*\d) → au moins un chiffre
    // (?=.*[^A-Za-z0-9]) → au moins un caractère spécial
    // .{8,} → longueur minimale 8
    static passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    static isValidUrl(url: string, domain?: string): boolean {
        try {
            const parsed = new URL(url);

            if (parsed.protocol !== 'https:') return false;
            if (domain && parsed.hostname !== domain && !parsed.hostname.endsWith(`.${domain}`)) {
                return false;
            }

            return true;
        } catch {
            return false;
        }
    }
}