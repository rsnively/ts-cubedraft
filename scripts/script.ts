import * as $ from "jquery";
import { Card, Type } from "../ts-out/card";
import { mtgo_vintage_cube } from "../ts-out/cubes/mtgo_vintage";

const card_width_actual = 223;
const card_height_actual = 311;

var card_width = card_width_actual;
var card_height = card_height_actual;

const NUM_PACKS = 3;
const NUM_PLAYERS = 8;

var collection = [];

var sortedByManaValue = true;   // Mana Value > Color > Name
var sortedByColor = false;      // Color > Name

var sideboard = [];

function makeImageTag(card) {
    return "<img src='http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=" + card.multiverseid + "&type=card' width=" + card_width + " height= " + card_height + " />";
}

function makeRelativeImageTag(card, left, top) {
    return "<img src='http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=" + card.multiverseid + "&type=card' width=" + card_width + " height=" + card_height + " style='position: absolute; left: " + left + "px; top: " + top + "px' />";
}

function getPacks(cube: Card[]): Card[][] {
    let packs = [];
    for (let pack_index = 0; pack_index < NUM_PACKS; pack_index++) {
        let pack = [];
        for (let player_index = 0; player_index < NUM_PLAYERS; player_index++) {
            const random_index = Math.floor(Math.random() * cube.length);
            // pack.push(cube.splice(random_index, 1));
            pack.push(cube[random_index]);
        }
        packs.push(pack);
    }
    return packs;
}

// Cut a card from a pack
function makePick(pack) {
    for (var i = 0; i < pack.length; i++) {
        var pick = Math.random();
        if (pick < 0.5) {
            pack.splice(i, 1);
            return;
        }
    }

    pack.splice(0, 1);
}

function addToCollection(card: Card) {
    if (sortedByManaValue) {
        for (let i = 0; i < collection.length; i++) {
            if (collection[i][0].ManaValue() === card.ManaValue()) {
                collection[i].push(card);
                return;
            }
            else if (collection[i][0].ManaValue() > card.ManaValue()) {
                collection.splice(i, 0, [card]);
                return;
            }
        }
        collection.push([card]);
        return;
    }
    if (sortedByColor) {
        for (var i = 0; i < collection.length; i++) {
            // Found column of appropriate color, insert alphabetically.
            if (collection[i][0].Colors() === card.Colors()) {
                for (var j = 0; j < collection[i].length; j++) {
                    if (card.name <= collection[i][j].name) {
                        collection[i].splice(j, 0, card);
                        return;
                    }
                }
                // Card is last in column alphabetically.
                collection[i].push(card);
                return;
            }
        }
        // Got to end of collection, push new column to end.
        collection.push([card]);
        return;
    }
    else {
        console.log("All of the sorting methods returned FALSE.");
    }
}

function drawSideboard() {
    $("#sideboard").html("");

    for (var i = 0; i < sideboard.length; i++) {
        $("#sideboard").append(makeImageTag(sideboard[i]));
    }

    $("#sideboard img").click(function () {
        var cardIndex = ($("#sideboard img").index(this));
        addToCollection(sideboard[cardIndex]);
        sideboard.splice(cardIndex, 1);

        drawSideboard();
        drawCollection();
    });
}

function sortCollection() {
    // var tempCollection = collection;
    // collection = [];

    // for (var i = 0; i < tempCollection.length; i++) {
    //     for (var j = 0; j < tempCollection[i].length; j++) {
    //         addToCollection(tempCollection[i][j]);
    //     }
    // }
}

function drawCollection() {
    $("#player_collection").html("");

    // Generate numbers
    var num_cards = 0;
    var num_creatures = 0;
    var num_lands = 0;
    for (var i = 0; i < collection.length; i++) {
        for (var j = 0; j < collection[i].length; j++) {
            num_cards++;
            const types = collection[i][j].types;

            if (types.includes(Type.Creature)) {
                num_creatures++;
            }
            else if (types.includes(Type.Land)) {
                num_lands++;
            }
        }
    }

    $("#player_collection").append("<p style='color: orange'>Cards: " + num_cards + "  Creatures: " + num_creatures + "  Lands: " + num_lands + "  Other: " + (num_cards - num_creatures - num_lands) + "</p>");

    // Draw cards
    for (var i = 0; i < collection.length; i++) {
        var bin = collection[i];

        for (var j = 0; j < bin.length; j++) {
            $("#player_collection").append(makeRelativeImageTag(bin[j], i * (card_width + 20), 40 + j * 32));
        }
    }

    $("#player_collection img").click(function () {
        var cardIndex = ($("#player_collection img").index(this));

        var index = 0;
        for (var i = 0; i < collection.length; i++) {
            for (var j = 0; j < collection[i].length; j++) {
                if (index === cardIndex) {
                    sideboard.push(collection[i][j]);
                    collection[i].splice(j, 1);
                    if (collection[i].length === 0) {
                        collection.splice(i, 1);
                    }

                    drawSideboard();
                    drawCollection();
                    return;
                }
                index++;
            }
        }

        drawSideboard();
        drawCollection();
    });
}

let current_round = 0;
let current_pack = 0;
let packs = [];

function drawPack() {
    const pack_index = current_round * NUM_PLAYERS + current_pack;
    var pack = packs[pack_index];
    $("#pack").html("");
    for (let i = 0; i < pack.length; i++) {
        $("#pack").append(makeImageTag(pack[i]));
    }
    drawCollection();

    $("#pack img").on("click", function () {
        const card_index = ($("#pack img").index(this));
        addToCollection(pack[card_index]);
        pack.splice(card_index, 1);

        for (let i = 0; i < NUM_PLAYERS; i++) {
            const ai_pack_index = current_round * NUM_PLAYERS + i;
            if (ai_pack_index != pack_index) {
                makePick(packs[ai_pack_index]);
            }
        }
        if (pack.length === 0) {
            current_round++;
            current_pack = 0;
            if (current_round === NUM_PACKS) {
                $("#pack").html("");
                drawCollection();
            } else {
                drawPack();
            }
        } else {
            current_pack = (current_pack + 1) % NUM_PLAYERS;
            drawPack();
        }
    });
}

function redrawSite() {
    $("body").html("");

    $("body").append("<div id='pack'></div>");
    $("body").append("<hr>");
    $("body").append("<span class='button' id='sort_mv'>Sort by Mana Value</span>");
    $("body").append("<span class='button' id='sort_color'>Sort by Color</span>");
    $("body").append("<hr>");
    $("body").append("<div id='player_collection'></div>");
    $("body").append("<hr>");
    $("body").append("<div id='sideboard'></div>");
    main();
}

function main() {
    let cube = [];
    if (cube.length === 0) {
        $("#mtgo_vintage").on("click", function () {
            cube = mtgo_vintage_cube();
            packs = getPacks(cube);
            redrawSite();
        });
    }
    else {
        drawPack();

        $("#sort_mv").on("click", function () {
            sortedByManaValue = true;
            sortedByColor = false;
            sortCollection();
            drawCollection();
        });

        $("#sort_color").on("click", function () {
            sortedByManaValue = false;
            sortedByColor = true;
            sortCollection();
            drawCollection();
        });
    }
}

$(document).ready(main);
// jQuery(main);
