/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package classes;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.net.MalformedURLException;
import java.util.HashSet;

/**
 *
 * @author Theo
 */
@JsonIgnoreProperties(value = {"handler", "hibernateLazyInitializer", "FieldHandler"})
public class Dataset {

    public int id;
    public String title;
    public String endpoint;
    public int triples;
    public int entities;
    public int properties;
    public int classes;
    public int cidocProperties;
    public int cidocClasses;
    public int triplesWithCIDOCinstance;
    public int triplesWithCIDOCproperty;
    public double triplesWithCIDOCpropertyPercentage;
    public double triplesWithCIDOCinstancePercentage;
    String description;
    String voidDescription;
    HashSet<Property> allProperties = new HashSet<Property>();
    HashSet<RDFClass> allClasses = new HashSet<RDFClass>();
    Queries q = new Queries();
    int triplesNumber, entitiesNumber;

    public Dataset() {
    }

    public Dataset(String tit, String desc, String endp) {
        title = tit;
        description = desc;
        endpoint = endp;
    }

    public Dataset(int id, String endpoint, String title, int triples, int entities, int properties,
            int classes, int cidocProperties, int cidocClasses, int triplesWithCIDOCinstance, int triplesWithCIDOCproperty, double triplesWithCIDOCpropertyPercentage, double triplesWithCIDOCinstancePercentage) {
        this.id = id;
        this.title = title;
        this.triples = triples;
        this.endpoint = endpoint;
        this.entities = entities;
        this.properties = properties;
        this.classes = classes;
        this.cidocProperties = cidocProperties;
        this.cidocClasses = cidocClasses;
        this.triplesWithCIDOCinstance = triplesWithCIDOCinstance;
        this.triplesWithCIDOCproperty = triplesWithCIDOCproperty;
        this.triplesWithCIDOCpropertyPercentage = triplesWithCIDOCpropertyPercentage;
        this.triplesWithCIDOCinstancePercentage = triplesWithCIDOCinstancePercentage;

    }

    public void runQueries() throws MalformedURLException, IOException {
        triplesNumber = q.sendQuery(endpoint, q.triplesQuery);
        entitiesNumber = q.sendQuery(endpoint, q.entitiesQuery);
        allProperties = q.propertyQueries(endpoint, q.propertiesInfoQuery);
        allClasses = q.classQueries(endpoint, q.classesInfoQuery);
    }

    public void datasetToVoID() {
        voidDescription = "@prefix void: <http://rdfs.org/ns/void#> .\n"
                + "@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n"
                + "@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n"
                + "@prefix owl: <http://www.w3.org/2002/07/owl#> .\n"
                + "@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n"
                + "@prefix dcterms: <http://purl.org/dc/terms/> .\n"
                + "@prefix foaf: <http://xmlns.com/foaf/0.1/> .\n"
                + "@prefix wv: <http://vocab.org/waiver/terms/norms> .        \n"
                + "@prefix sd: <http://www.w3.org/ns/sparql-service-description#> . \n\n";

        voidDescription += "<" + endpoint + "> a void:Dataset;\n"
                + "    dcterms:title \"" + title + "\";\n"
                + "    dcterms:description \"" + description + "\";\n"
                + "    void:entities \"" + entitiesNumber + "\";\n"
                + "    void:triples \"" + triplesNumber + "\";\n";

        for (Property p : allProperties) {
            voidDescription += "   void:propertyPartition [ \n"
                    + "        void:property " + p.url + ";\n"
                    + "        void:triples \"" + p.triples + "\";\n"
                    + "    ];\n";
        }

        for (RDFClass cl : allClasses) {
            voidDescription += "   void:classPartition  [ \n"
                    + "        void:class " + cl.url + ";\n"
                    + "        void:triples \"" + cl.triples + "\";\n"
                    + "    ];\n";
        }

        voidDescription += " .";
        System.out.println(voidDescription);
    }

    public void storeStatsToFile() {
        File f = new File(title + ".ttl");
        try {
            FileWriter myWriter = new FileWriter(title + ".ttl");
            myWriter.write(voidDescription);
            myWriter.close();
            System.out.println("Successfully wrote to the file.");
        } catch (IOException e) {
            System.out.println("An error occurred.");
            e.printStackTrace();
        }
    }

    public void uploadFilesToVirtuoso() {
        Upload_Files_To_Virtuoso uftv = new Upload_Files_To_Virtuoso();
        uftv.uploadNewFile(title + ".ttl");

    }

}
