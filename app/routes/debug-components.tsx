import { useState } from "react";
import { JoinToPopup } from "~/routes/joinTo";
import { CreateRoomPage } from "./createTo";

export default function DebugComponents() {
  const [activeComponent, setActiveComponent] = useState<string>("joinTo");

  // デバッグしたいコンポーネントをここに追加
  const components = {
    joinTo: {
      name: "部屋参加ポップアップ",
      component: <JoinToPopup />
    },
    // 将来的に他のコンポーネントを追加する場合はここに追加
    createTo: {
      name: "部屋作成ポップアップ",
      component: <CreateRoomPage />
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px" }}>コンポーネントデバッガー</h1>
      
      <div style={{ marginBottom: "20px" }}>
        <h2>コンポーネント選択</h2>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {Object.entries(components).map(([key, { name }]) => (
            <button 
              key={key}
              onClick={() => setActiveComponent(key)}
              style={{
                padding: "8px 16px",
                backgroundColor: activeComponent === key ? "#111" : "#eee",
                color: activeComponent === key ? "#fff" : "#111",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ 
        padding: "20px",
        border: "1px dashed #ccc",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9"
      }}>
        <h2>プレビュー: {components[activeComponent]?.name}</h2>
        <div style={{ margin: "20px 0" }}>
          {components[activeComponent]?.component}
        </div>
      </div>
      
      <div style={{ marginTop: "40px" }}>
        <h3>デバッグ情報</h3>
        <pre style={{ 
          backgroundColor: "#f0f0f0", 
          padding: "10px", 
          borderRadius: "4px",
          overflow: "auto" 
        }}>
          {`現在表示中: ${components[activeComponent]?.name}`}
        </pre>
      </div>
    </div>
  );
}
