export type PathNode =
    | {
          command: string;
      }
    | {
          x: number;
          y: number;
      }
    | { a: number };

/// Rudimentary (i.e. not-correct) parsing of svg <path> 'd' attribute strings
export function parse(d: string): PathNode[] {
    const commands = [];
    const dividers = new Set([' ', ',', '\n']);
    const dividersRe = new RegExp(`[${[...dividers].join('')}]`);
    const nonNumbers = new Set([...dividers, '.']);
    const numbers = new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']);
    for (const char of d) {
        if (!nonNumbers.has(char) && !numbers.has(char)) {
            commands.push(char);
        }
    }
    const points = d
        .split(new RegExp(`[${[...new Set(commands)].join('')}]`))
        .filter((s) => s.length > 0);
    const result = [];
    console.log(d, commands, points);
    for (let i = 0; i < Math.max(points.length, commands.length); i++) {
        if (i < commands.length) {
            result.push({ command: commands[i] });
        }
        if (i < points.length) {
            const splitPoints = points[i]
                .split(dividersRe)
                .map((p) => Number.parseFloat(p));
            dividersRe.lastIndex = 0;
            for (let j = 0; j < splitPoints.length; j += 2) {
                if (j + 1 < splitPoints.length) {
                    result.push({ x: splitPoints[j], y: splitPoints[j + 1] });
                } else {
                    result.push({ x: undefined, y: splitPoints[j] });
                }
            }
        }
    }
    return result;
}

/// Serialize list of nodes (which just joins them all with spaces)
export function serialize(nodes: PathNode[]) {
    return nodes
        .map((v) => {
            if ('command' in v) {
                return v.command;
            } else if ('x' in v) {
                return [v.x, v.y].filter((s) => !Number.isNaN(s)).join(' ');
            } else {
                return `${v.a}`;
            }
        })
        .join(' ');
}
