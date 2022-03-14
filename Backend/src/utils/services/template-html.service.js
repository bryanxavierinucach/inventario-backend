
const TemplateEmailService = require("../../modules/divergenti/services/template-email.services");
const { OPPORTUNITY_ASSIGNED_PYME, FEEDBACK, ACHIEVEMENT_ASSIGNED } = require("../config/template-email.config");

const templateEmailService = new TemplateEmailService();

module.exports = class TemplateHtmlService {

    async getTemplateFeedback(sections, feedbacks) {
        if (feedbacks && feedbacks.length > 0) {
            let html = await templateEmailService.findByCode('FEEDBACK');
            if (html == null || html == undefined) {
                html = FEEDBACK;
            }
            const sectionHtml = html.split('<LOOP-SECTION>');
            if (sectionHtml.length < 2) {
                html = FEEDBACK;
            }
            let htmlFinal = html;
            htmlFinal = sectionHtml[0];
            htmlFinal = htmlFinal.replace('*|QUESTIONARY_TITLE|*', feedbacks[0].dataValues.section.questionary.questionaryTitle);
            for (let i = 0; i < sections.length; i++) {
                const section = sections[i];
                for (let j = 0; j < feedbacks.length; j++) {
                    const feedback = feedbacks[j].dataValues; // datavalues porque viene desde base de datos
                    if (section.feedbackId == feedback.id) {
                        htmlFinal += sectionHtml[1];
                        htmlFinal = htmlFinal.replace('*|SECTION_NAME|*', feedback.section.sectionName);
                        htmlFinal = htmlFinal.replace('*|TOTAL_SCORE|*', section.totalScore);
                        htmlFinal = htmlFinal.replace('*|LEVEL|*', feedback.level);
                        htmlFinal = htmlFinal.replace('*|RECOMMENDATION|*', this.getWithEnterDisplay(feedback.recommendation));
                    }
                }
            }
            for (let i = 2; i < sectionHtml.length; i++) {
                const element = sectionHtml[i];
                htmlFinal += element;
            }
            return htmlFinal;
        } else {
            return null;
        }
    }

    /**
     * Template html para cuando se acepta una oportunidad
     * @param {*} opportunity 
     * @returns 
     */
    async getTemplateOpportunityAssigned(opportunity) {
        let html = await templateEmailService.findByCode('OPPORTUNITY_ASSIGNED_PYME');
        if (html == null || html == undefined) {
            html = OPPORTUNITY_ASSIGNED_PYME;
        }
        return html.replace('*|TITLE|*', opportunity.title);
    }

    async getTemplateAchievement(dataUser, data, achieve) {
        let html = await templateEmailService.findByCode('ACHIEVEMENT_ASSIGNED');
        if (html == null || html == undefined) {
            html = ACHIEVEMENT_ASSIGNED;
        }
        let score = '';
        if (data.score == '3') score = "Buena"
        else if (data.score == '6') score = "Muy Buena"
        else if (data.score == '9') score = "Excelente"
        html = html.replace('*|DESCRIPTION|*', achieve.description);
        html = html.replace('*|IMAGE|*', process.env.HOST_ASSETS+ achieve.picture);
        html = html.replace('*|USER|*', dataUser.user);
        html = html.replace('*|EMAIL|*', dataUser.email);
        html = html.replace('*|SCORE|*', score);
        return html;
    }

    getWithEnterDisplay(text) {
        return text.replace('\n', '<br><br>');
    }

}