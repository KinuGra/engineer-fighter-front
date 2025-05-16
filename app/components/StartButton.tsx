export const action = async () => {
    console.log("Start button clicked");
};

const StartButton = () => {
    return (
        <button
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
            type="button"
            onClick={action}
        >
            Start Game
        </button>
    );
};

export default StartButton;
