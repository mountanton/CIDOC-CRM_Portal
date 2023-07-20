/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package classes;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.openrdf.model.URI;
import org.openrdf.repository.RepositoryConnection;
import org.openrdf.repository.RepositoryException;
import org.openrdf.rio.RDFFormat;
import org.openrdf.rio.RDFParseException;
import virtuoso.sesame2.driver.VirtuosoRepository;

/**
 *
 * @author Theo
 */
public class Upload_Files_To_Virtuoso {
    //Put your virtuoso

    String virtuosoHost = "83.212.97.78";
    String virtuosoPort = "1111";
    String virtuosoUserName = "dba";
    String virtuosoPassword = "nC9s";

    /**
     * @param args the command line arguments
     */
    public void uploadNewFile(String file) {
        File f = new File(file);
        Upload_Files_To_Virtuoso upload = new Upload_Files_To_Virtuoso();

        String graphspace = "http://www.ics.forth.gr/isl/CIDOC_VoID";
        try {
            upload.uploadFileToVirtuoso(f, graphspace);
        } catch (RepositoryException ex) {
            Logger.getLogger(Upload_Files_To_Virtuoso.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(Upload_Files_To_Virtuoso.class.getName()).log(Level.SEVERE, null, ex);
        } catch (RDFParseException ex) {
            Logger.getLogger(Upload_Files_To_Virtuoso.class.getName()).log(Level.SEVERE, null, ex);
        }

    }

    public void uploadFileToVirtuoso(File file, String graphSpace) throws RepositoryException, IOException, RDFParseException {

        VirtuosoRepository virt_repository = new VirtuosoRepository("jdbc:virtuoso://"
                + virtuosoHost + ":" + virtuosoPort
                + "/charset=UTF-8/log_enable=2",
                virtuosoUserName, virtuosoPassword);

        RepositoryConnection conn = virt_repository.getConnection();
        System.out.println("Uploading File: " + file + " to graphSpace: " + graphSpace);
        RDFFormat format = RDFFormat.NTRIPLES;
        if (file.getName().endsWith("ttl")) {
            format = RDFFormat.TURTLE;
        }
        URI graph = conn.getRepository().getValueFactory().createURI(graphSpace);
        conn.add(file, null, format, graph);
    }
}
