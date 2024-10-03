// Constants
const MAX_FORCE_MAGNITUDE = 150;
const MIN_FORCE_MAGNITUDE = -50;
const MAX_WATER_FORCE = 120;
const MIN_WATER_FORCE = -280;
const HUE_WATER = 198;
const LIGHTNESS_PARTY = 100;

class NodeBase {
    constructor(xx, yy, data, mathMode) {
        this.xx = xx;
        this.yy = yy;
        this.data = data;
        this.mathMode = mathMode;

        this.omniForce = 0;
        this.fx = 0;
        this.fy = 0;
        this.nextFx = 0;
        this.nextFy = 0;
        this.currentForce = 0;
        this.nextForce = 0;

        this.isAddedToUpdate = false;
        this.isMoveForceDelayComplete = true;

        // Assign appropriate methods based on mathMode
        this.assignMathModeMethods();
    }

    assignMathModeMethods() {
        if (this.mathMode === "helias") {
            this.updateNode = this.updateNodeHelias;
            this.computeForceAndDrawNode = this.computeForceAndDrawNodeHelias;
        } else {
            this.updateNode = this.updateNodeAnair;
            this.computeForceAndDrawNode = this.computeForceAndDrawNodeAnair;
        }
    }

    applyListeners() {
        this.element.onclick = () => this.startRipple();
        this.element.onmousemove = () => this.handleMouseMoveRipple();
    }

    handleMouseMoveRipple() {
        if (!this.data.rippleOnMove || !this.isMoveForceDelayComplete) return;
        this.isMoveForceDelayComplete = false;
        this.startRipple();
        setTimeout(() => (this.isMoveForceDelayComplete = true), 500);
    }

    getNodeElement() {
        this.element = document.createElement("div");
        this.element.className = "cell";
        this.element.style.display = "block";
        this.element.style.width = "100%";
        this.element.style.height = "100%";
        this.drawNode(0);
        this.applyListeners();
        return this.element;
    }

    startRipple(rippleStrength = 0) {
        rippleStrength = rippleStrength || this.data.maxRippleStrength;
        this.omniForce = rippleStrength;
        this.currentForce = rippleStrength;
        this.drawNode(rippleStrength);

        // Add surrounding nodes to update queue
        for (let yChange = -1; yChange <= 1; yChange++) {
            for (let xChange = -1; xChange <= 1; xChange++) {
                this.data.addToUpdateQueue(this.xx + xChange, this.yy + yChange);
            }
        }
    }

    updateForces(xChange, yChange, xForce, yForce) {
        const isOrthogonal = xChange === 0 || yChange === 0;
        const forceDivider = isOrthogonal ? 1 : 2;
        this.nextFx += xForce / forceDivider;
        this.nextFy += yForce / forceDivider;
    }

    // Helias math mode logic
    updateNodeHelias() {
        const forces = [
            this.getForceFromNeighbor(this.xx, this.yy - 1),
            this.getForceFromNeighbor(this.xx, this.yy + 1),
            this.getForceFromNeighbor(this.xx + 1, this.yy),
            this.getForceFromNeighbor(this.xx - 1, this.yy)
        ];
        this.nextForce = (forces.reduce((sum, force) => sum + force, 0)) / 2 - this.nextForce;
        this.nextForce *= this.data.forceDampeningRatio;
        this.data.addToDrawQueue(this.xx, this.yy);
    }

    getForceFromNeighbor(x, y) {
        const neighbor = this.data.getNode(x, y);
        return neighbor ? neighbor.currentForce : 0;
    }

    updateNodeAnair() {
        for (let yChange = -1; yChange <= 1; yChange++) {
            for (let xChange = -1; xChange <= 1; xChange++) {
                if (yChange === 0 && xChange === 0) continue;
                const node = this.data.getNode(this.xx + xChange, this.yy + yChange);
                if (!node) continue;
                if (node.omniForce !== 0) {
                    this.updateForces(xChange, yChange, -xChange * node.omniForce, -yChange * node.omniForce);
                } else {
                    this.updateForceFromNode(node, xChange, yChange);
                }
            }
        }

        if (this.nextFx !== 0 || this.nextFy !== 0) {
            this.enqueueNextForces();
        }

        this.data.addToDrawQueue(this.xx, this.yy);
    }

    updateForceFromNode(node, xChange, yChange) {
        let deltaFx = 0, deltaFy = 0;

        if (xChange === 0 || yChange === 0) {
            if (xChange * node.fx < 0) deltaFx = node.fx;
            if (yChange * node.fy < 0) deltaFy = node.fy;
        } else if (xChange * node.fx < 0 && yChange * node.fy < 0) {
            deltaFx = node.fx;
            deltaFy = node.fy;
        }

        this.updateForces(xChange, yChange, deltaFx, deltaFy);
    }

    enqueueNextForces() {
        for (let yChange = 0; yChange <= (this.nextFy !== 0); yChange++) {
            for (let xChange = 0; xChange <= (this.nextFx !== 0); xChange++) {
                this.data.addToUpdateQueue(
                    this.xx + Math.sign(this.nextFx) * xChange,
                    this.yy + Math.sign(this.nextFy) * yChange
                );
            }
        }
    }

    // Drawing logic
    drawNode(forceMagnitude) {
        forceMagnitude = Math.max(MIN_FORCE_MAGNITUDE, Math.min(MAX_FORCE_MAGNITUDE, forceMagnitude));
        const hueValue = 0;
        const saturationValue = 0;
        const lightnessValue = 25 + forceMagnitude / 2;
        this.element.style.background = `hsl(${hueValue}, ${saturationValue}%, ${lightnessValue}%)`;
    }

    computeForceAndDrawNodeHelias() {
        if (Math.abs(this.nextForce) < this.data.forceCutOff) this.nextForce = 0;
        this.drawNode(this.nextForce);
        [this.currentForce, this.nextForce] = [this.nextForce, this.currentForce];
        this.enqueueNeighborUpdates();
    }

    computeForceAndDrawNodeAnair() {
        this.omniForce = 0;
        this.fx = Math.floor(this.nextFx * this.data.forceDampeningRatio);
        this.fy = Math.floor(this.nextFy * this.data.forceDampeningRatio);

        this.applyForceCutoff();

        const magnitude = Math.min(Math.sqrt(this.fx ** 2 + this.fy ** 2), 100);
        this.drawNode(magnitude);
    }

    applyForceCutoff() {
        if (Math.abs(this.fx) < this.data.forceCutOff) this.fx = 0;
        if (Math.abs(this.fy) < this.data.forceCutOff) this.fy = 0;
        this.nextFx = 0;
        this.nextFy = 0;
    }

    enqueueNeighborUpdates() {
        const neighbors = [
            [this.xx - 1, this.yy],
            [this.xx + 1, this.yy],
            [this.xx, this.yy - 1],
            [this.xx, this.yy + 1]
        ];
        neighbors.forEach(([x, y]) => this.data.addToUpdateQueue(x, y));
    }
}

// Custom Node Implementations

class WaterNode extends NodeBase {
    drawNode(forceMagnitude) {
        forceMagnitude = Math.max(MIN_WATER_FORCE, Math.min(MAX_WATER_FORCE, forceMagnitude));
        const hueValue = HUE_WATER;
        const saturationValue = 70 + forceMagnitude / 4;
        const lightnessValue = 70 + forceMagnitude / 8;
        this.element.style.background = `hsl(${hueValue}, ${saturationValue}%, ${lightnessValue}%)`;
    }
}

class PartyNode extends NodeBase {
    drawNode(forceMagnitude) {
        forceMagnitude = Math.max(-200, Math.min(120, forceMagnitude));
        const hueValue = Math.floor(Math.random() * 360);
        const saturationValue = 70 + forceMagnitude / 4;
        const lightnessValue = LIGHTNESS_PARTY - forceMagnitude / 2;
        this.element.style.background = `hsl(${hueValue}, ${saturationValue}%, ${lightnessValue}%)`;
    }
}

class AsciiNode extends NodeBase {
    constructor(xx, yy, data, mathMode) {
        super(xx, yy, data, mathMode);
        this.element.style.fontSize = "14px";
        this.element.style.textAlign = "center";
    }

    drawNode(forceMagnitude) {
        forceMagnitude = Math.max(-200, Math.min(200, forceMagnitude));
        const colorValue = Math.floor(128 + forceMagnitude / 2);
        const asciiSymbol = this.getAsciiSymbol(forceMagnitude);
        this.element.innerText = asciiSymbol;
        this.element.style.color = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
    }

    getAsciiSymbol(forceMagnitude) {
        if (forceMagnitude < -150) return "#";
        if (forceMagnitude < -50) return "@";
        if (forceMagnitude < 50) return "%";
        if (forceMagnitude < 150) return "*";
        return ".";
    }
}
