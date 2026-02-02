-- CreateIndex
CREATE INDEX "Execution_workflowID_startedAt_idx" ON "Execution"("workflowID", "startedAt" DESC);
