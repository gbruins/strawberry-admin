import { fileURLToPath } from 'url';
import { dirname } from 'path';
import svgstore from 'svgstore';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// const globAsync = promisify(glob);

const svgSpritePath = path.resolve(__dirname, '../src/components/svgIcon/svg');

function getSvgFileNames() {
    const svgSpriteFiles = fs.readdirSync(svgSpritePath);
    return svgSpriteFiles.map((file) => file.replace('.svg', ''));
}


const svgSprite = async () => {
    let sprites = svgstore({
        copyAttrs: true,
        svgAttrs: {
            width: 0,
            height: 0,
            style: 'display: none;',
        },
    });

    const fileNames = getSvgFileNames();

    fileNames.forEach((fileName) => {
        const svg = fs.readFileSync(path.resolve(svgSpritePath, `${fileName}.svg`), 'utf8');

        sprites.add(
            fileName,
            svg,
            {
                symbolAttrs: {
                    class: `svg-icon svg-icon-${fileName}`
                }
            }
        );
    });

    sprites = sprites.toString({
        inline: true
    });

    fs.writeFileSync(
        path.resolve(__dirname, '../src/components/svgIcon/SvgSprite.vue'),
        `<template>${sprites}</template>`
    );

    console.log(chalk.green('SVG Sprite generated'));
}


async function svgList() {
    const files = getSvgFileNames();

    let content = '/** THIS FILE IS GENERATED. DO NO EDIT MANUALLY */\r\n';
    content += `export default ${JSON.stringify(files)};`;

    fs.writeFileSync(
        path.resolve(__dirname, '../src/components/svgIcon/svgFileNames.js'),
        content
    );
}


svgList();
svgSprite();
