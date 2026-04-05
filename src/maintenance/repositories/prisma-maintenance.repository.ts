import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type {
  MaintenanceRepository,
  PerformanceIndicatorParams,
  RawPerformanceRow,
} from './maintenance.repository.interface';

type QueryResult = {
  familia_nome: string;
  tempo_prev: string | number | bigint;
  tempo_corretiva: string | number | bigint;
  total_paradas: string | number | bigint;
};

@Injectable()
export class PrismaMaintenanceRepository implements MaintenanceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getRawPerformanceByFamily(
    params: PerformanceIndicatorParams,
  ): Promise<RawPerformanceRow[]> {
    const { startDate, endDate, clientId, typeMaintenanceIds } = params;

    const typeFilter =
      typeMaintenanceIds.length > 0
        ? Prisma.sql`AND EXISTS (
            SELECT 1 FROM controle_de_ordens_de_servico os
            WHERE os.ID = p.id_ordem_servico
              AND os.tipo_manutencao IN (${Prisma.join(typeMaintenanceIds)})
          )`
        : Prisma.empty;

    const results = await this.prisma.$queryRaw<QueryResult[]>`
      SELECT
        f.familia AS familia_nome,
        COALESCE(
          SUM(TIME_TO_SEC(TIMEDIFF(et.termino, et.inicio))) / 3600,
          0
        ) AS tempo_prev,
        COALESCE(
          SUM(
            CASE
              WHEN p.data_hora_start IS NOT NULL AND p.data_hora_stop IS NOT NULL
              THEN TIMESTAMPDIFF(SECOND, p.data_hora_stop, p.data_hora_start) / 3600
              ELSE 0
            END
          ),
          0
        ) AS tempo_corretiva,
        COUNT(DISTINCT p.id) AS total_paradas
      FROM cadastro_de_familias_de_equipamento f
      JOIN cadastro_de_equipamentos e
        ON e.id_familia = f.ID
        AND e.id_cliente = f.ID_cliente
      LEFT JOIN sofman_prospect_escala_trabalho et
        ON et.id_equipamento = e.ID
        AND et.data_programada >= ${startDate}
        AND et.data_programada <= ${endDate}
      LEFT JOIN sofman_apontamento_paradas p
        ON p.id_equipamento = e.ID
        AND p.data_hora_stop >= ${startDate}
        AND p.data_hora_stop < DATE_ADD(${endDate}, INTERVAL 1 DAY)
        ${typeFilter}
      WHERE f.ID_cliente = ${clientId}
      GROUP BY f.ID, f.familia
      ORDER BY f.familia ASC
    `;

    return results.map((row) => ({
      familia_nome: row.familia_nome,
      tempo_prev: Number(row.tempo_prev),
      tempo_corretiva: Number(row.tempo_corretiva),
      total_paradas: Number(row.total_paradas),
    }));
  }
}
