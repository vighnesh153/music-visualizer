import { ICanvasAnimation } from "./IAnimation";

(async () => {
    const { BarsAnimation } = await import('./BarsAnimation');
    const { SinusoidalWaveAnimation } = await import('./SinusoidalWaveAnimation');

    let analyzer: AnalyserNode;
    let animationRunning = true;
    const byteFrequencyDataArray = new Uint8Array(1024);
    const byteTimeDomainDataArray = new Uint8Array(1024);

    const allAnimations: ICanvasAnimation[] = [
        new BarsAnimation(),
        new SinusoidalWaveAnimation()
    ];

    const stopAllAnimations = () => {
        animationRunning = false;
    };

    const animateAll = () => {
        animationRunning = true;
        analyzer.fftSize = 2048;
        analyzer.smoothingTimeConstant = 0.9;
        analyzer.getByteFrequencyData(byteFrequencyDataArray);
        analyzer.getByteTimeDomainData(byteTimeDomainDataArray);

        allAnimations.forEach((animation: ICanvasAnimation) => {
            animation.animate(byteFrequencyDataArray, byteTimeDomainDataArray);
        });

        if (animationRunning) {
            requestAnimationFrame(animateAll);
        }
    };

    window.onload = () => {
        console.log('App bootstrapping!');

        const audioContext = new AudioContext();
        analyzer = audioContext.createAnalyser();

        const audioElement = document.querySelector('audio');
        const audioSource = audioContext.createMediaElementSource(audioElement);
        audioSource.connect(analyzer);
        analyzer.connect(audioContext.destination);

        audioElement.addEventListener('play', animateAll);
        audioElement.addEventListener('pause', stopAllAnimations);

        console.log('App bootstrapped.');
        console.log('Waiting for user events to process!');
    };
})();
