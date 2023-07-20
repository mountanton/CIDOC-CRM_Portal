/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package requestClasses;

/**
 *
 * @author Theo
 */
public class RequestAddDataset {

    public String datasetName;
    public String url;
    public String creator;
    public String description;
    public String email;
    public int numberOfTriples;
    public int numberOfEntities;
    public int numberOfProperties;
    public int numberOfClasses;

    public RequestAddDataset(String datasetName, String url, String creator, String description, String email, int numberOfTriples, int numberOfEntities, int numberOfProperties, int numberOfClasses) {
        this.datasetName = datasetName;
        this.url = url;
        this.creator = creator;
        this.description = description;
        this.email = email;
        this.numberOfTriples = numberOfTriples;
        this.numberOfEntities = numberOfEntities;
        this.numberOfProperties = numberOfProperties;
        this.numberOfClasses = numberOfClasses;
    }
}
