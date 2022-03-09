module.exports = {
    OPPORTUNITY_ASSIGNED_PYME: ` <strong>Fuiste aceptado para la oportunidad que postulaste: 
    *|TITLE|*</strong>
    <br>
    `,
    // LOOP-SECTION para identificar lo que se va a repetir
    FEEDBACK: `
    <h1>*|QUESTIONARY_TITLE|*</h1>
    <LOOP-SECTION> 
    <h2>*|SECTION_NAME|*: Puntaje *|TOTAL_SCORE|* </h2>
    <h3>Nivel: *|LEVEL|*</h3>
    <h4>Recomendaciones:</h4>
    <p>*|RECOMMENDATION|*</p>
    <LOOP-SECTION>
    `,
    ACHIEVEMENT_ASSIGNED: `<h1>Se ha asignado un nuevo logro</h1>
    <h3> *|DESCRIPTION|*</h3>
    <div>
    <ul>
    <li> <b>Username:</b>  *|USER|*</li>
    <li> <b>User Email:</b> *|EMAIL|*</li>
    <li> <b>Calificación:</b> *|SCORE|*</li>
    </ul>
    <p>Se ha asignado y validado un nuevo logro</p>
    </div>`
};