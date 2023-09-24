import { GITHUB_STRATEGY, GOOGLE_STRATEGY } from 'src/config';

export interface StrategyConfiguration {
  password: string;
}

export const googleStrategyConfig: StrategyConfiguration = {
  password: GOOGLE_STRATEGY.password,
};

export const githubStrategyConfig: StrategyConfiguration = {
  password: GITHUB_STRATEGY.password,
};
