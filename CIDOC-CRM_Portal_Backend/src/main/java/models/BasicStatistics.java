/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package models;

/**
 *
 * @author Theo
 */
public class BasicStatistics {

    public int triples;
    public int entities;
    public String description;
    public int properties;
    public int classes;
    public String title;
    public int triplesWithCIDOCproperty;
    public double triplesWithCIDOCpropertyPercentage;
    public int triplesWithCIDOCinstance;
    public double triplesWithCIDOCinstancePercentage;
    public int propertiesCIDOC;
    public int classesCIDOC;

    public BasicStatistics() {
    }

    public BasicStatistics(int triples, int entities, String description, int properties, int classes, String title,
            int triplesWithCIDOCproperty, double triplesWithCIDOCpropertyPercentage, int triplesWithCIDOCinstance,
            double triplesWithCIDOCinstancePercentage, int propertiesCIDOC, int classesCIDOC) {
        this.triples = triples;
        this.entities = entities;
        this.description = description;
        this.properties = properties;
        this.classes = classes;
        this.title = title;
        this.triplesWithCIDOCproperty = triplesWithCIDOCproperty;
        this.triplesWithCIDOCpropertyPercentage = triplesWithCIDOCpropertyPercentage;
        this.triplesWithCIDOCinstance = triplesWithCIDOCinstance;
        this.triplesWithCIDOCinstancePercentage = triplesWithCIDOCinstancePercentage;
        this.propertiesCIDOC = propertiesCIDOC;
        this.classesCIDOC = classesCIDOC;
    }
}
