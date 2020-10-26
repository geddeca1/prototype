module.exports = function(eleventyConfig){
    eleventyConfig.addPassthroughCopy("assets");

    return{
        addPassthroughCopy: true,
        markdownTemplateEngine: "njk",
        templateFormats: ["html","njk","md"],
        dir:{
            input: "src",
            output:"_site",
            include: "includes"
        }
    }
}
