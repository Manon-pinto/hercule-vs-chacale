import { REQUEST_TIMEOUT_MS } from './constants';

// Le webhook répond désormais immédiatement avec un simple accusé de
// réception. Le rapport de contrôle est transmis par email par n8n,
// il n'est plus retourné à l'application.
export type ControleAck = {
  status: 'processing';
  message?: string;
};

export type ControleResponse = ControleAck;

export class ControleError extends Error {
  readonly kind: 'timeout' | 'network' | 'http' | 'parse';
  readonly status?: number;
  constructor(
    message: string,
    kind: 'timeout' | 'network' | 'http' | 'parse',
    status?: number,
  ) {
    super(message);
    this.name = 'ControleError';
    this.kind = kind;
    this.status = status;
  }
}

export async function submitControle(
  herculeFiles: File[],
  chacalFiles: File[],
  signal?: AbortSignal,
): Promise<ControleResponse> {
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
  const authToken = import.meta.env.VITE_N8N_AUTH_TOKEN;

  if (!webhookUrl || !authToken) {
    throw new ControleError(
      'Configuration manquante (VITE_N8N_WEBHOOK_URL ou VITE_N8N_AUTH_TOKEN)',
      'network',
    );
  }

  const formData = new FormData();
  herculeFiles.forEach((f, i) => formData.append(`hercule_pdf_${i}`, f));
  chacalFiles.forEach((f, i) => formData.append(`chacal_pdf_${i}`, f));

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(new DOMException('Timeout', 'TimeoutError')),
    REQUEST_TIMEOUT_MS,
  );

  if (signal) {
    signal.addEventListener('abort', () => controller.abort(signal.reason));
  }

  let response: Response;
  try {
    response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'X-RPI-Auth': authToken,
      },
      body: formData,
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof DOMException && err.name === 'TimeoutError') {
      throw new ControleError(
        `L'analyse a dépassé ${REQUEST_TIMEOUT_MS / 1000}s. Réessayez ou contactez l'admin.`,
        'timeout',
      );
    }
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ControleError('Requête annulée', 'network');
    }
    throw new ControleError(
      `Erreur réseau : ${err instanceof Error ? err.message : String(err)}`,
      'network',
    );
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new ControleError(
      `Le serveur n8n a retourné une erreur (${response.status}). ${body.substring(0, 200)}`,
      'http',
      response.status,
    );
  }

  try {
    const json = await response.json();
    return json as ControleResponse;
  } catch (err) {
    throw new ControleError(
      `Réponse n8n invalide : ${err instanceof Error ? err.message : String(err)}`,
      'parse',
    );
  }
}
