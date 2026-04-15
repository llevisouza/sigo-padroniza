import { FormAluno } from "./components/FormAluno";
import { AppHeader } from "./components/AppHeader";
import { DashboardSidebar } from "./components/DashboardSidebar";
import { ExportModal } from "./components/ExportModal";
import { NotificationToast } from "./components/NotificationToast";
import { ValidationBanner } from "./components/ValidationBanner";
import { WorkspaceView } from "./components/WorkspaceView";
import { WorkspaceStatsBar } from "./components/WorkspaceStatsBar";
import { useAlunoWorkspace } from "./hooks/useAlunoWorkspace";

export default function App() {
  const workspace = useAlunoWorkspace();

  return (
    <div className="flex h-screen flex-col bg-slate-50 font-sans text-slate-900">
      <AppHeader
        alunosCount={workspace.alunos.length}
        isBusy={workspace.isPending}
        onExport={workspace.handleExport}
        searchField={workspace.searchField}
        searchTerm={workspace.searchTerm}
        onSearchFieldChange={workspace.setSearchFieldAndReset}
        onSearchTermChange={workspace.setSearchTermAndReset}
      />

      <main className="mx-auto grid flex-1 min-h-0 w-full max-w-[1600px] grid-cols-1 gap-4 overflow-y-auto px-4 py-4 sm:px-6 xl:h-[calc(100vh-4rem)] xl:grid-cols-[248px_minmax(0,1fr)] xl:overflow-hidden xl:px-8">
        <DashboardSidebar
          onUpload={workspace.handleUpload}
          onUploadError={(message) => workspace.showNotification("error", message)}
        />

        <div className="flex min-h-0 flex-col gap-4 overflow-hidden">
          {workspace.alunos.length > 0 && <WorkspaceStatsBar stats={workspace.stats} />}

          <ValidationBanner
            visible={workspace.alunos.length > 0}
            stats={workspace.stats}
            filterMode={workspace.filterMode}
            errorFieldFilter={workspace.errorFieldFilter}
            onApplyFilter={workspace.applyFilter}
            onClearErrorFieldFilter={workspace.clearErrorFieldFilter}
          />

          <WorkspaceView
            activeTab={workspace.activeTab}
            filterMode={workspace.filterMode}
            preferredAdjustmentField={workspace.preferredAdjustmentField}
            adjustAllLabel={workspace.batchAdjustLabel}
            exportReport={workspace.exportReport}
            hasReportContent={workspace.hasReportContent}
            alunos={workspace.alunos}
            filteredAlunos={workspace.filteredAlunos}
            paginatedAlunos={workspace.paginatedAlunos}
            insightsById={workspace.insightsById}
            currentPage={workspace.currentPage}
            totalPages={workspace.totalPages}
            pageSize={workspace.pageSize}
            isBusy={workspace.isPending}
            onTabChange={workspace.setActiveTab}
            onClearData={workspace.handleClearImportedData}
            onAdjustAll={workspace.handleAdjustAll}
            onAddAluno={workspace.handleAddAluno}
            onDeleteAluno={workspace.handleDeleteAluno}
            onEditAluno={workspace.handleEditAluno}
            onAdjustAluno={workspace.handleAdjustAluno}
            onMainPageChange={workspace.setCurrentPage}
            onMainPageSizeChange={workspace.setMainPageSize}
            statsAdjustableFields={workspace.filteredAdjustableFields}
            adjustmentHistory={workspace.adjustmentHistory}
            paginatedAdjustmentHistory={workspace.paginatedAdjustmentHistory}
            historyCurrentPage={workspace.historyCurrentPage}
            totalHistoryPages={workspace.totalHistoryPages}
            historyPageSize={workspace.historyPageSize}
            onHistoryPageChange={workspace.setHistoryCurrentPage}
            onHistoryPageSizeChange={workspace.setHistoryPageSizeAndReset}
            alunosById={workspace.alunosById}
            onRevertAdjustment={workspace.handleRevertAdjustment}
            historyStats={workspace.historyStats}
            reportIssues={workspace.reportIssues}
            paginatedReportIssues={workspace.paginatedReportIssues}
            issuesCurrentPage={workspace.issuesCurrentPage}
            totalIssuePages={workspace.totalIssuePages}
            issuesPageSize={workspace.issuesPageSize}
            onIssuesPageChange={workspace.setIssuesCurrentPage}
            onIssuesPageSizeChange={workspace.setIssuesPageSizeAndReset}
          />
        </div>
      </main>

      {workspace.isFormOpen && (
        <FormAluno
          aluno={workspace.editingAluno}
          onSave={workspace.handleSaveAluno}
          onClose={workspace.closeForm}
        />
      )}

      <ExportModal
        open={workspace.isExportModalOpen}
        onClose={workspace.closeExportModal}
        onConfirm={workspace.handleConfirmExport}
        initialInstitutionCode={workspace.initialInstitutionCode}
      />

      <NotificationToast notification={workspace.notification} onClose={workspace.dismissNotification} />
    </div>
  );
}
