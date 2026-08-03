import AIBot from '../../new_shapes/components/AIBot';

export default function ResidentAIBotPreview() {
  return (
    <div className="admin-bot-preview" aria-label="תצוגה מקדימה של העוזר באפליקציית תושבים">
      <div className="admin-phone-frame">
        <div className="admin-phone-screen">
          <AIBot
            embedded
            open
            startRect={null}
            onClose={() => {}}
            onAutomationActivate={() => {}}
            onAutomationsOpen={() => {}}
            onEventsOpen={() => {}}
            onNewsOpen={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
