
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import {
    Paintbrush,
    Eraser,
    RotateCcw,
    Download,
    Printer,
    Palette,
    RefreshCw,
    Undo
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const COLORS = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#00FFFF', '#FF00FF', '#FFA500', '#800080',
    '#A52A2A', '#808080', '#FFC0CB', '#40E0D0', '#FFD700'
];

export default function MandalaStudio() {
    const { t } = useLanguage();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(2);
    const [segments, setSegments] = useState(12);
    const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
    const { toast } = useToast();
    const [history, setHistory] = useState<ImageData[]>([]);
    const lastPos = useRef<{ x: number, y: number } | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set white background initially
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Save initial state
        saveState();
    }, []);

    const saveState = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (history.length > 10) {
            setHistory(prev => [...prev.slice(1), ctx.getImageData(0, 0, canvas.width, canvas.height)]);
        } else {
            setHistory(prev => [...prev, ctx.getImageData(0, 0, canvas.width, canvas.height)]);
        }
    };

    const handleUndo = () => {
        if (history.length <= 1) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const newHistory = [...history];
        newHistory.pop(); // Remove current state
        const previousState = newHistory[newHistory.length - 1];

        ctx.putImageData(previousState, 0, 0);
        setHistory(newHistory);
    };

    const getCoordinates = (event: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;

        if ('touches' in event) {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else {
            clientX = (event as React.MouseEvent).clientX;
            clientY = (event as React.MouseEvent).clientY;
        }

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        const { x, y } = getCoordinates(e);
        lastPos.current = { x, y };
        drawSymmetry(x, y, x, y);
    };

    const stopDrawing = () => {
        if (isDrawing) {
            setIsDrawing(false);
            lastPos.current = null;
            saveState();
        }
    };

    const drawMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing || !lastPos.current) return;
        const { x, y } = getCoordinates(e);
        drawSymmetry(lastPos.current.x, lastPos.current.y, x, y);
        lastPos.current = { x, y };
    };

    const drawSymmetry = (x1: number, y1: number, x2: number, y2: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;

        const angleStep = (Math.PI * 2) / segments;

        for (let i = 0; i < segments; i++) {
            const rotation = i * angleStep;

            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(rotation);
            ctx.translate(-centerX, -centerY);

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            ctx.restore();
        }
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveState();
    };

    // --- Pattern Generators ---

    const drawFlower = (ctx: CanvasRenderingContext2D, cx: number, cy: number, maxR: number) => {
        const rings = 4 + Math.floor(Math.random() * 4);
        for (let r = 1; r <= rings; r++) {
            const radius = (maxR / rings) * r;
            const petals = segments;
            const angleStep = (Math.PI * 2) / petals;

            for (let i = 0; i < petals; i++) {
                const angle = i * angleStep;
                const nextAngle = (i + 1) * angleStep;

                ctx.beginPath();
                const cp1x = cx + (radius * 1.3) * Math.cos(angle + angleStep / 2);
                const cp1y = cy + (radius * 1.3) * Math.sin(angle + angleStep / 2);

                ctx.moveTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
                ctx.quadraticCurveTo(cp1x, cp1y, cx + radius * Math.cos(nextAngle), cy + radius * Math.sin(nextAngle));
                ctx.stroke();
            }
        }
    };

    const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, maxR: number) => {
        const layers = 3 + Math.floor(Math.random() * 3);
        for (let l = 0; l < layers; l++) {
            const r1 = (maxR / layers) * (l + 0.5);
            const r2 = (maxR / layers) * (l + 1);
            const points = segments;
            const angleStep = (Math.PI * 2) / points;

            ctx.beginPath();
            for (let i = 0; i < points * 2; i++) {
                const r = i % 2 === 0 ? r2 : r1;
                const angle = i * (angleStep / 2);
                ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
            }
            ctx.closePath();
            ctx.stroke();
        }
    };

    const drawGeometric = (ctx: CanvasRenderingContext2D, cx: number, cy: number, maxR: number) => {
        const shapes = 5 + Math.floor(Math.random() * 5);
        for (let s = 1; s <= shapes; s++) {
            const radius = (maxR / shapes) * s;
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.stroke();

            if (s % 2 === 0) {
                // Draw polygon
                const sides = segments / (Math.random() > 0.5 ? 1 : 2);
                const angleStep = (Math.PI * 2) / sides;
                ctx.beginPath();
                for (let i = 0; i <= sides; i++) {
                    const angle = i * angleStep;
                    ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
                }
                ctx.stroke();
            }
        }
    };

    const drawWeb = (ctx: CanvasRenderingContext2D, cx: number, cy: number, maxR: number) => {
        // Radial lines
        const lines = segments * 2;
        const angleStep = (Math.PI * 2) / lines;
        for (let i = 0; i < lines; i++) {
            const angle = i * angleStep;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + maxR * Math.cos(angle), cy + maxR * Math.sin(angle));
            ctx.stroke();
        }

        // Spiral connections
        const rings = 10;
        for (let r = 1; r <= rings; r++) {
            const radius = (maxR / rings) * r;
            ctx.beginPath();
            for (let i = 0; i <= lines; i++) {
                const angle = i * angleStep;
                // Add some curve
                const rOffset = radius + Math.sin(i) * 5;
                ctx.lineTo(cx + rOffset * Math.cos(angle), cy + rOffset * Math.sin(angle));
            }
            ctx.stroke();
        }
    };

    const generateTemplate = () => {
        clearCanvas();
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const maxRadius = Math.min(centerX, centerY) - 20;

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1.5;

        const patterns = ['flower', 'star', 'geometric', 'web'];
        const type = patterns[Math.floor(Math.random() * patterns.length)];

        if (type === 'flower') drawFlower(ctx, centerX, centerY, maxRadius);
        else if (type === 'star') drawStar(ctx, centerX, centerY, maxRadius);
        else if (type === 'geometric') drawGeometric(ctx, centerX, centerY, maxRadius);
        else drawWeb(ctx, centerX, centerY, maxRadius);

        saveState();
    };

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const link = document.createElement('a');
        link.download = `mandala-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();

        toast({
            title: t.mandala_studio.saved_toast,
            description: t.mandala_studio.saved_desc,
        });
    };

    const handlePrint = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const win = window.open('', '', 'height=600,width=800');
        if (win) {
            win.document.write('<html><head><title>Print Mandala</title></head><body style="text-align:center;">');
            win.document.write('<img src="' + canvas.toDataURL() + '" style="max-width:100%; max-height:100vh;"/>');
            win.document.write('</body></html>');
            win.document.close();
            win.print();
        }
    };

    return (
        <div className="container mx-auto p-4 h-[calc(100vh-4rem)] flex flex-col md:flex-row gap-4">
            {/* Tools Sidebar */}
            <Card className="w-full md:w-64 flex-shrink-0 overflow-y-auto">
                <CardContent className="p-4 space-y-6">
                    <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Palette className="w-4 h-4" /> {t.mandala_studio.tools}
                        </h3>
                        <div className="flex gap-2">
                            <Button
                                variant={tool === 'brush' ? "default" : "outline"}
                                size="icon"
                                onClick={() => setTool('brush')}
                                title={t.mandala_studio.brush}
                            >
                                <Paintbrush className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={tool === 'eraser' ? "default" : "outline"}
                                size="icon"
                                onClick={() => setTool('eraser')}
                                title={t.mandala_studio.eraser}
                            >
                                <Eraser className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-semibold">{t.mandala_studio.size}: {brushSize}px</h3>
                        <Slider
                            value={[brushSize]}
                            min={1}
                            max={20}
                            step={1}
                            onValueChange={(v) => setBrushSize(v[0])}
                        />
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-semibold">{t.mandala_studio.segments}: {segments}</h3>
                        <Slider
                            value={[segments]}
                            min={4}
                            max={32}
                            step={2}
                            onValueChange={(v) => setSegments(v[0])}
                        />
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-semibold">{t.mandala_studio.colors}</h3>
                        <div className="grid grid-cols-5 gap-2">
                            {COLORS.map(c => (
                                <button
                                    key={c}
                                    className={`w-8 h-8 rounded-full border-2 ${color === c ? 'border-primary scale-110' : 'border-transparent'}`}
                                    style={{ backgroundColor: c }}
                                    onClick={() => {
                                        setColor(c);
                                        setTool('brush');
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t">
                        <Button variant="outline" className="w-full justify-start" onClick={handleUndo}>
                            <Undo className="w-4 h-4 mr-2" /> {t.mandala_studio.undo}
                        </Button>
                        <Button variant="outline" className="w-full justify-start" onClick={clearCanvas}>
                            <RotateCcw className="w-4 h-4 mr-2" /> {t.mandala_studio.clear}
                        </Button>
                        <Button variant="outline" className="w-full justify-start" onClick={generateTemplate}>
                            <RefreshCw className="w-4 h-4 mr-2" /> {t.mandala_studio.generate}
                        </Button>
                    </div>

                    <div className="space-y-2 pt-4 border-t">
                        <Button className="w-full justify-start" onClick={handleDownload}>
                            <Download className="w-4 h-4 mr-2" /> {t.mandala_studio.save}
                        </Button>
                        <Button variant="secondary" className="w-full justify-start" onClick={handlePrint}>
                            <Printer className="w-4 h-4 mr-2" /> {t.mandala_studio.print}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Canvas Area */}
            <Card className="flex-1 flex items-center justify-center bg-muted/20 overflow-hidden">
                <div className="relative shadow-2xl bg-white rounded-lg overflow-hidden touch-none">
                    <canvas
                        ref={canvasRef}
                        width={800}
                        height={800}
                        className="w-full h-full max-w-[80vh] max-h-[80vh] cursor-crosshair"
                        onMouseDown={startDrawing}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onMouseMove={drawMove}
                        onTouchStart={startDrawing}
                        onTouchEnd={stopDrawing}
                        onTouchMove={drawMove}
                    />
                </div>
            </Card>
        </div>
    );
}
