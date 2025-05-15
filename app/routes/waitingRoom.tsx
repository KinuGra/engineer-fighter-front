import pkg from 'react-loader-spinner';
const { Grid } = pkg;

export function WaitingRoom() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "60vh"
    }}>
      <h1 style={{ marginBottom: "32px" }}>待合室</h1>
      <Grid
        height="100"
        width="100"
        color="#4fa94d"
        ariaLabel="audio-loading"
        wrapperStyle={{}}
        wrapperClass="wrapper-class"
        visible={true}
      />
      <div style={{ marginTop: "24px", color: "#666", fontSize: "18px" }}>
        しばらくお待ちください...
      </div>
    </div>
  );
}