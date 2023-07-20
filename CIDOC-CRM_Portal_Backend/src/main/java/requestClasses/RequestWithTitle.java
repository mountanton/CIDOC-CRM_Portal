/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package requestClasses;

/**
 *
 * @author Theo
 */
public class RequestWithTitle {

    public String title;
    public int limit;
    public int page;
    public int totalEntries = 0;

    public RequestWithTitle(String title, int limit, int page) {
        this.title = title;
        this.limit = limit;
        this.page = page;
    }
}
