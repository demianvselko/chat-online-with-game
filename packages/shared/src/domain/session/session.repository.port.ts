import type { Session } from "./session.entity";
import type { SessionIdVO, UserIdVO, GameIdVO } from "./session.vo";
import type { SessionStatus } from "./session.enums";

export interface SessionRepositoryPort {
  findById(id: SessionIdVO): Promise<Session | null>;
  findActiveByUser(userId: UserIdVO): Promise<Session[]>;
  findByGameAndStatus(
    gameId: GameIdVO,
    status: SessionStatus,
  ): Promise<Session[]>;
  save(session: Session): Promise<void>;
  delete(id: SessionIdVO): Promise<void>;
}
