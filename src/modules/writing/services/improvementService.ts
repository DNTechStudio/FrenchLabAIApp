import type { ImprovementResult } from '../domain/types.ts';

export interface ImprovementRequest {
  promptId: string;
  promptTitle: string;
  promptScenario: string;
  promptInstructions: string;
  essayContent: string;
}

export interface ImprovementService {
  improveEssay(request: ImprovementRequest): Promise<ImprovementResult>;
}
