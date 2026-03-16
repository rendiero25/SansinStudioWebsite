
import { getSection } from "./src/services/sectionApi";

async function checkIcons() {
    try {
        const section = await getSection("home", "section5");
        console.log("Section 5 Solutions:");
        section.content.solutions.forEach(s => {
            console.log(`Title: ${s.title}, Icon: ${s.icon?.url}`);
        });
        
        const solutionSection = await getSection("solution", "section2");
        console.log("\nSolution Section Categories:");
        solutionSection.content.categories.forEach(c => {
            console.log(`Name: ${c.categoryName}, Icon: ${c.categoryIcon?.url}`);
        });
    } catch (e) {
        console.error(e);
    }
}

checkIcons();
